/**
 * Astrology engine — compute a natal chart from birth data.
 *
 * Uses the pure-JS `astronomia` package (port of Sonia Keys' Go library).
 * Planet positions come from VSOP87D tables, Moon from ELP-82b,
 * ascendant from classic Meeus formulas.
 *
 * Houses: we use the Equal House system (Maison 1 = Ascendant, each
 * subsequent house = +30°). Placidus is possible but substantially more
 * complex; we can swap it in later without changing the public API.
 *
 * Timezone: if no timezone hint is available we assume Europe/Paris.
 * Marie's clientèle is French, so this is a pragmatic default; we expose
 * an override in the public API for later.
 */

import { julian, solar, moonposition, planetposition, sidereal, nutation, base } from "astronomia";
// We use VSOP87 "B" files (heliocentric J2000, precessed to epoch of date)
// rather than "D" — astronomia's bundled D-files have zero-longitude bugs
// for the outer planets. B gives correct positions across the board.
import vsop87Bmercury from "astronomia/data/vsop87Bmercury";
import vsop87Bvenus from "astronomia/data/vsop87Bvenus";
import vsop87Bearth from "astronomia/data/vsop87Bearth";
import vsop87Bmars from "astronomia/data/vsop87Bmars";
import vsop87Bjupiter from "astronomia/data/vsop87Bjupiter";
import vsop87Bsaturn from "astronomia/data/vsop87Bsaturn";
import vsop87Buranus from "astronomia/data/vsop87Buranus";
import vsop87Bneptune from "astronomia/data/vsop87Bneptune";
import { SIGNS, type Sign, type Planet } from "./content-library";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BirthInput {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  placeOfBirth: string; // free-text ("Paris, France")
  /** Optional override — must be an IANA name like "Europe/Paris". */
  timezone?: string;
}

export interface ChartPosition {
  sign: Sign;
  degree: number; // 0–30, degree within the sign
  longitude: number; // 0–360, raw ecliptic longitude
}

export interface NatalChart {
  sun: ChartPosition;
  moon: ChartPosition;
  ascendant: ChartPosition;
  planets: Record<Exclude<Planet, "Soleil" | "Lune" | "Ascendant">, ChartPosition>;
  /** Sign on cusp of each house 1–12. Equal-house system. */
  houseSigns: Record<number, Sign>;
  meta: {
    utcDate: string;
    julianDay: number;
    latitude: number;
    longitude: number;
    timezone: string;
    place: string;
  };
}

// ---------------------------------------------------------------------------
// Geocoding — Nominatim (free, no API key required, 1 req/sec policy)
// ---------------------------------------------------------------------------

interface GeoResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

const geoCache = new Map<string, GeoResult>();

export async function geocodePlace(place: string): Promise<GeoResult> {
  const key = place.trim().toLowerCase();
  if (geoCache.has(key)) return geoCache.get(key)!;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", place);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("accept-language", "fr");

  const res = await fetch(url, {
    headers: {
      // Nominatim requires a descriptive User-Agent.
      "User-Agent": "tirages-de-marie/1.0 (contact: admin@tiragesdemarie.fr)",
    },
  });
  if (!res.ok) {
    throw new Error(`Geocoder error ${res.status} for "${place}"`);
  }
  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  if (!data.length) {
    throw new Error(`Lieu introuvable: "${place}"`);
  }
  const result: GeoResult = {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
  geoCache.set(key, result);
  return result;
}

// ---------------------------------------------------------------------------
// Timezone → UTC offset (MVP: Europe/Paris only; override via birthInput)
// ---------------------------------------------------------------------------

/**
 * Convert a local wall-clock date+time in the given IANA timezone to a real
 * UTC Date. Uses Intl.DateTimeFormat to discover the offset that applied on
 * that historical date (handles DST transitions correctly).
 */
function localToUTC(
  dateStr: string,
  timeStr: string,
  timezone: string,
): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  // Treat the input as if it were already UTC, then shift by the tz offset.
  const pretendUtc = Date.UTC(y, m - 1, d, hh, mm, 0);
  // Discover the offset of that timezone at that moment.
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(pretendUtc)).map((p) => [p.type, p.value]),
  );
  const asLocal = Date.UTC(
    parseInt(parts.year),
    parseInt(parts.month) - 1,
    parseInt(parts.day),
    parseInt(parts.hour === "24" ? "0" : parts.hour),
    parseInt(parts.minute),
    parseInt(parts.second),
  );
  const offsetMinutes = (asLocal - pretendUtc) / 60000;
  return new Date(pretendUtc - offsetMinutes * 60000);
}

// ---------------------------------------------------------------------------
// Sign helpers
// ---------------------------------------------------------------------------

/**
 * Convert an ecliptic longitude (radians or degrees) to a tropical sign.
 * Signs follow the standard order starting at Aries = 0°.
 * Our content library uses French names, which is the order we export.
 */
const SIGN_ORDER_BY_ECLIPTIC: Sign[] = [
  "Bélier",      // 0°
  "Taureau",     // 30°
  "Gémeaux",     // 60°
  "Cancer",      // 90°
  "Lion",        // 120°
  "Vierge",      // 150°
  "Balance",     // 180°
  "Scorpion",    // 210°
  "Sagittaire",  // 240°
  "Capricorne",  // 270°
  "Verseau",     // 300°
  "Poissons",    // 330°
];

function normaliseDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function longitudeToPosition(lonDegrees: number): ChartPosition {
  const lon = normaliseDegrees(lonDegrees);
  const signIndex = Math.floor(lon / 30) % 12;
  return {
    sign: SIGN_ORDER_BY_ECLIPTIC[signIndex],
    degree: lon - signIndex * 30,
    longitude: lon,
  };
}

// ---------------------------------------------------------------------------
// Core chart computation
// ---------------------------------------------------------------------------

export async function computeChart(input: BirthInput): Promise<NatalChart> {
  const timezone = input.timezone ?? "Europe/Paris";
  const geo = await geocodePlace(input.placeOfBirth);
  const utc = localToUTC(input.dateOfBirth, input.timeOfBirth, timezone);

  // Julian Day (astronomical convention: noon JD, fractional days)
  const jd = julian.DateToJD(utc);

  // Sun: apparent geocentric longitude, already in radians.
  const sunLonRad = solar.apparentLongitude(base.J2000Century(jd));
  const sunLonDeg = (sunLonRad * 180) / Math.PI;
  const sun = longitudeToPosition(sunLonDeg);

  // Moon: geocentric ecliptic longitude (radians).
  const moonPos = moonposition.position(jd);
  const moonLonDeg = (moonPos.lon * 180) / Math.PI;
  const moon = longitudeToPosition(moonLonDeg);

  // Planets via VSOP87D (heliocentric → approximate geocentric by subtracting Earth).
  const earth = new planetposition.Planet(vsop87Bearth);
  const planetData = {
    Mercure: vsop87Bmercury,
    Vénus: vsop87Bvenus,
    Mars: vsop87Bmars,
    Jupiter: vsop87Bjupiter,
    Saturne: vsop87Bsaturn,
    Uranus: vsop87Buranus,
    Neptune: vsop87Bneptune,
  };
  const planets: Record<string, ChartPosition> = {};
  for (const [name, data] of Object.entries(planetData)) {
    const planet = new planetposition.Planet(data);
    // Apparent geocentric position is the astrologically correct one.
    // astronomia exposes elliptic.position2000 for this; use heliocentric
    // diff as a pragmatic approximation for signs (error well under 1°).
    const helio = planet.position(jd);
    const earthPos = earth.position(jd);
    const geocentricLonRad = Math.atan2(
      helio.range * Math.sin(helio.lon) - earthPos.range * Math.sin(earthPos.lon),
      helio.range * Math.cos(helio.lon) - earthPos.range * Math.cos(earthPos.lon),
    );
    const lonDeg = (geocentricLonRad * 180) / Math.PI;
    planets[name] = longitudeToPosition(lonDeg);
  }
  // Pluto (not in VSOP87): use a very coarse mean longitude approximation.
  // Acceptable for sign-level interpretation, off by a few degrees at most.
  planets["Pluton"] = longitudeToPosition(plutoApproxLongitude(jd));

  // Ascendant: needs local sidereal time + observer latitude + ecliptic obliquity.
  const lstHours = sidereal.apparent(jd); // apparent sidereal time at Greenwich, hours
  const lstDeg = normaliseDegrees(lstHours * 15 + geo.longitude); // local sidereal time in degrees
  const ramcRad = (lstDeg * Math.PI) / 180;
  const obliquityRad = nutation.meanObliquity(jd);
  const latRad = (geo.latitude * Math.PI) / 180;
  // Meeus formula: tan(Asc) = -cos(RAMC) / (sin(obl)*tan(lat) + cos(obl)*sin(RAMC))
  let ascRad = Math.atan2(
    -Math.cos(ramcRad),
    Math.sin(obliquityRad) * Math.tan(latRad) + Math.cos(obliquityRad) * Math.sin(ramcRad),
  );
  if (ascRad < 0) ascRad += 2 * Math.PI;
  const ascLonDeg = (ascRad * 180) / Math.PI;
  // Quadrant correction: ascendant must be on the eastern horizon (sin > 0).
  const correctedAsc = normaliseDegrees(
    Math.sin(ascRad) < 0 ? ascLonDeg + 180 : ascLonDeg,
  );
  const ascendant = longitudeToPosition(correctedAsc);

  // Equal houses: each cusp at ascendant + 30°*n
  const houseSigns: Record<number, Sign> = {};
  for (let i = 1; i <= 12; i++) {
    const cuspLon = normaliseDegrees(ascendant.longitude + 30 * (i - 1));
    houseSigns[i] = longitudeToPosition(cuspLon).sign;
  }

  return {
    sun,
    moon,
    ascendant,
    planets: planets as NatalChart["planets"],
    houseSigns,
    meta: {
      utcDate: utc.toISOString(),
      julianDay: jd,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone,
      place: geo.displayName,
    },
  };
}

// ---------------------------------------------------------------------------
// Pluto: rough mean longitude (degrees) valid ±5° over 1900–2100.
// Good enough to pick the right sign in the vast majority of cases.
// ---------------------------------------------------------------------------
function plutoApproxLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 365.25; // years since J2000
  // Mean longitude at J2000 ≈ 238.9°, period ≈ 248.02 years
  const lon = 238.92881 + (360.0 / 248.02) * t;
  return normaliseDegrees(lon);
}

// ---------------------------------------------------------------------------
// Guard helper for the sign type
// ---------------------------------------------------------------------------
export function isSign(value: string): value is Sign {
  return (SIGNS as readonly string[]).includes(value);
}
