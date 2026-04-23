/**
 * Assembly engine — turns a BookletRequest + NatalChart + content library
 * into a structured BookletContent JSON, ready for any renderer.
 *
 * The renderer stays format-agnostic: we produce semantic sections
 * (cover, intro, sun-sign, …) and the PDF/HTML/email templates are
 * responsible for how they look.
 */

import type { NatalChart } from "./astro-engine";
import {
  contentLibrary,
  lookupPlanet,
  lookupHouse,
  type Sign,
  type Planet,
} from "./content-library";

export interface BirthProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  placeOfBirth: string;
  email?: string;
}

export interface SectionBlock {
  /** Subtitle, e.g. "Lune en Verseau" or "Maison 4 — en Scorpion". */
  title: string;
  /** Explicit anchor ("sun", "moon", "ascendant", "planet:Mars", "house:4"). */
  anchor: string;
  /** Paragraph text; empty string if Marie hasn't filled this combination. */
  body: string;
}

export interface BookletContent {
  profile: BirthProfile;
  chart: NatalChart;
  cover: {
    title: string;
    subtitle: string;
  };
  overview: {
    title: string;
    body: string;
  };
  sun: SectionBlock;
  moon: SectionBlock;
  ascendant: SectionBlock;
  planets: SectionBlock[];
  houses: SectionBlock[];
  conclusion: {
    title: string;
    body: string;
  };
}

// ---------------------------------------------------------------------------
// Fallback copy for empty library cells.
// ---------------------------------------------------------------------------

const GENERIC_SUN_FALLBACK =
  "Votre Soleil révèle la lumière profonde que vous portez et la façon dont vous vous affirmez dans le monde.";

const GENERIC_ASC_FALLBACK =
  "Votre Ascendant représente le masque que vous présentez au monde et la manière dont vous entrez en relation avec les autres.";

function planetBody(sign: Sign, planet: Planet): string {
  const body = lookupPlanet(sign, planet);
  if (body && body.length > 20) return body;
  if (planet === "Soleil") return GENERIC_SUN_FALLBACK;
  if (planet === "Ascendant") return GENERIC_ASC_FALLBACK;
  return `Marie n'a pas encore rédigé ce paragraphe (${planet} en ${sign}). Il sera ajouté prochainement.`;
}

function houseBody(sign: Sign, n: number): string {
  const body = lookupHouse(sign, n);
  if (body && body.length > 20) return body;
  return `Marie n'a pas encore rédigé ce paragraphe (Maison ${n} en ${sign}). Il sera ajouté prochainement.`;
}

function birthDateHuman(profile: BirthProfile): string {
  const d = new Date(profile.dateOfBirth + "T00:00:00");
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

export function assembleBooklet(
  profile: BirthProfile,
  chart: NatalChart,
): BookletContent {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  const cover = {
    title: fullName || "Votre livret astral",
    subtitle: `${birthDateHuman(profile)} — ${profile.timeOfBirth} — ${profile.placeOfBirth}`,
  };

  const overview = {
    title: "Votre alignement cosmique",
    body: [
      `${profile.firstName}, ce livret est une invitation à découvrir la carte du ciel qui vous accompagne depuis votre premier souffle.`,
      `Votre Soleil est en ${chart.sun.sign}, votre Lune en ${chart.moon.sign}, et votre Ascendant en ${chart.ascendant.sign} — cette trinité forme l'empreinte unique de votre personnalité.`,
      `Dans les pages qui suivent, nous déploierons chaque planète dans son signe, puis l'accent que chaque maison donne à votre parcours. Prenez le temps, laissez résonner ce qui vient vous parler.`,
    ].join("\n\n"),
  };

  const sun: SectionBlock = {
    title: `Soleil en ${chart.sun.sign}`,
    anchor: "sun",
    body: planetBody(chart.sun.sign, "Soleil"),
  };
  const moon: SectionBlock = {
    title: `Lune en ${chart.moon.sign}`,
    anchor: "moon",
    body: planetBody(chart.moon.sign, "Lune"),
  };
  const ascendant: SectionBlock = {
    title: `Ascendant en ${chart.ascendant.sign}`,
    anchor: "ascendant",
    body: planetBody(chart.ascendant.sign, "Ascendant"),
  };

  const planets: SectionBlock[] = [];
  const planetOrder: Exclude<Planet, "Soleil" | "Lune" | "Ascendant">[] = [
    "Mercure",
    "Vénus",
    "Mars",
    "Jupiter",
    "Saturne",
    "Uranus",
    "Neptune",
    "Pluton",
  ];
  for (const p of planetOrder) {
    const pos = chart.planets[p];
    if (!pos) continue;
    planets.push({
      title: `${p} en ${pos.sign}`,
      anchor: `planet:${p}`,
      body: planetBody(pos.sign, p),
    });
  }

  const houses: SectionBlock[] = [];
  for (let n = 1; n <= 12; n++) {
    const sign = chart.houseSigns[n];
    if (!sign) continue;
    houses.push({
      title: `Maison ${n} — ${sign}`,
      anchor: `house:${n}`,
      body: houseBody(sign, n),
    });
  }

  const conclusion = {
    title: "En conclusion",
    body: [
      `${profile.firstName}, votre thème natal est une clé — pas une prison. Ce qui est écrit dans les étoiles éclaire, mais c'est toujours vous qui avancez.`,
      `Gardez ce livret comme un compagnon de route. Relisez-le à des moments-clés, notez ce qui résonne, laissez tomber ce qui ne vous correspond plus.`,
      `Avec tendresse,\nMarie`,
    ].join("\n\n"),
  };

  return {
    profile,
    chart,
    cover,
    overview,
    sun,
    moon,
    ascendant,
    planets,
    houses,
    conclusion,
  };
}

// ---------------------------------------------------------------------------
// Helpers for the content-coverage preview
// ---------------------------------------------------------------------------

export function findGaps(content: BookletContent): string[] {
  const gaps: string[] = [];
  const sections: SectionBlock[] = [
    content.sun,
    content.moon,
    content.ascendant,
    ...content.planets,
    ...content.houses,
  ];
  for (const s of sections) {
    if (s.body.startsWith("Marie n'a pas encore rédigé")) {
      gaps.push(s.title);
    }
  }
  return gaps;
}

/** Debug-friendly dump. */
export function summarise(content: BookletContent): string {
  const gaps = findGaps(content);
  return [
    `Livret pour ${content.cover.title}`,
    `Soleil: ${content.sun.title}`,
    `Lune: ${content.moon.title}`,
    `Asc: ${content.ascendant.title}`,
    `Planètes: ${content.planets.map((p) => p.title).join(", ")}`,
    `Maisons: ${content.houses.length} maisons`,
    `Gaps Marie: ${gaps.length}`,
  ].join("\n");
}
