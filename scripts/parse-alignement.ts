/**
 * Parse Marie's "Alignement en détails" PDF text export into a typed
 * content library.
 *
 * Input:  /tmp/alignement.txt  (pdftotext -layout output)
 * Output: server/content-library.ts
 *
 * Structure of the source:
 *   Verseau :
 *   Planètes
 *   Soleil :
 *   Lune : <paragraph>
 *   Saturne : <paragraph>
 *   ...
 *   Maisons
 *   Maison 1 : <paragraph>
 *   Maison 2 : <paragraph>
 *   ...
 *   <next sign :>
 */

import fs from "node:fs";
import path from "node:path";

const INPUT = process.argv[2] ?? "/tmp/alignement.txt";
const OUTPUT = path.resolve("server/content-library.ts");

// Canonical sign keys used everywhere downstream.
const SIGNS = [
  "Bélier",
  "Taureau",
  "Gémeaux",
  "Cancer",
  "Lion",
  "Vierge",
  "Balance",
  "Scorpion",
  "Sagittaire",
  "Capricorne",
  "Verseau",
  "Poissons",
] as const;
type Sign = (typeof SIGNS)[number];

// Marie wrote "Poisson" (singular) — normalise to the canonical plural.
const SIGN_ALIASES: Record<string, Sign> = {
  Poisson: "Poissons",
  Scorpion: "Scorpion",
};

const PLANET_KEYS = [
  "Soleil",
  "Lune",
  "Ascendant",
  "Mercure",
  "Vénus",
  "Mars",
  "Jupiter",
  "Saturne",
  "Uranus",
  "Neptune",
  "Pluton",
] as const;
type Planet = (typeof PLANET_KEYS)[number];

interface SignContent {
  planets: Partial<Record<Planet, string>>;
  houses: Partial<Record<number, string>>;
}

function normaliseSign(raw: string): Sign | null {
  const cleaned = raw.replace(/\s*:\s*$/, "").trim();
  if ((SIGNS as readonly string[]).includes(cleaned)) return cleaned as Sign;
  const alias = SIGN_ALIASES[cleaned];
  return alias ?? null;
}

function isSignHeader(line: string): Sign | null {
  // Sign lines look like "Verseau :" or "Scorpion:" (Marie's spacing varies).
  const match = line.match(/^([A-ZÀ-Ý][A-Za-zÀ-ÿ]+)\s*:\s*$/);
  if (!match) return null;
  return normaliseSign(match[1]);
}

function parse(raw: string): Record<Sign, SignContent> {
  const lines = raw.split(/\r?\n/);

  const library: Record<Sign, SignContent> = {} as any;
  for (const s of SIGNS) {
    library[s] = { planets: {}, houses: {} };
  }

  let currentSign: Sign | null = null;
  let currentSection: "planets" | "houses" | null = null;
  let currentKey: { kind: "planet"; name: Planet } | { kind: "house"; num: number } | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (!currentSign || !currentKey || buffer.length === 0) {
      buffer = [];
      return;
    }
    const text = buffer.join(" ").replace(/\s+/g, " ").trim();
    if (text.length === 0) {
      buffer = [];
      return;
    }
    if (currentKey.kind === "planet") {
      library[currentSign].planets[currentKey.name] = text;
    } else {
      library[currentSign].houses[currentKey.num] = text;
    }
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === "Alignement en détails") continue;

    // Sign header?
    const signHeader = isSignHeader(trimmed);
    if (signHeader) {
      flush();
      currentSign = signHeader;
      currentSection = null;
      currentKey = null;
      continue;
    }

    // Section markers
    if (trimmed === "Planètes") {
      flush();
      currentSection = "planets";
      currentKey = null;
      continue;
    }
    if (trimmed === "Maisons") {
      flush();
      currentSection = "houses";
      currentKey = null;
      continue;
    }

    if (!currentSign) continue;

    // House entry: "Maison 1 :" / "Maison 1:" / "Maison 1 :<text>"
    // Detect regardless of section because Marie only adds a "Maisons" header
    // in 2 of 12 signs. Auto-switch the section when we hit the first house.
    const houseMatch = trimmed.match(/^Maison\s+(\d{1,2})\s*:\s*(.*)$/);
    if (houseMatch) {
      flush();
      currentSection = "houses";
      currentKey = { kind: "house", num: parseInt(houseMatch[1], 10) };
      if (houseMatch[2]) buffer.push(houseMatch[2]);
      continue;
    }

    // Planet entry: "Soleil :" or "Lune : <text>"
    // Guard: only treat as planet if we haven't already flipped into houses
    // for this sign (Marie sometimes names people like "Mars :" in prose;
    // only line-start planet tokens count as headers).
    if (currentSection !== "houses") {
      const planetMatch = trimmed.match(
        /^(Soleil|Lune|Ascendant|Mercure|Vénus|Mars|Jupiter|Saturne|Uranus|Neptune|Pluton)\s*:\s*(.*)$/,
      );
      if (planetMatch) {
        flush();
        currentSection = "planets";
        currentKey = { kind: "planet", name: planetMatch[1] as Planet };
        if (planetMatch[2]) buffer.push(planetMatch[2]);
        continue;
      }
    }

    // Otherwise, continuation line of the current block.
    if (currentKey) {
      buffer.push(trimmed);
    }
  }

  flush();
  return library;
}

function formatOutput(lib: Record<Sign, SignContent>): string {
  const pretty = JSON.stringify(lib, null, 2);
  return `/**
 * Marie's personal content library — parsed from "Alignement en détails"
 * (generated by scripts/parse-alignement.ts, do not edit by hand; update the
 * source PDF and re-run the parser instead).
 *
 * Lookups:
 *   contentLibrary["Verseau"].planets["Lune"]   // text for "Lune en Verseau"
 *   contentLibrary["Cancer"].houses[4]          // text for "Maison 4 en Cancer"
 *
 * Empty strings mean Marie hasn't written that combination yet — the assembly
 * engine should fall back to a generic paragraph in that case.
 */

export const SIGNS = [
  "Bélier",
  "Taureau",
  "Gémeaux",
  "Cancer",
  "Lion",
  "Vierge",
  "Balance",
  "Scorpion",
  "Sagittaire",
  "Capricorne",
  "Verseau",
  "Poissons",
] as const;
export type Sign = (typeof SIGNS)[number];

export const PLANETS = [
  "Soleil",
  "Lune",
  "Ascendant",
  "Mercure",
  "Vénus",
  "Mars",
  "Jupiter",
  "Saturne",
  "Uranus",
  "Neptune",
  "Pluton",
] as const;
export type Planet = (typeof PLANETS)[number];

export interface SignContent {
  planets: Partial<Record<Planet, string>>;
  houses: Partial<Record<number, string>>;
}

export const contentLibrary: Record<Sign, SignContent> = ${pretty} as const;

export function lookupPlanet(sign: Sign, planet: Planet): string {
  return contentLibrary[sign]?.planets?.[planet] ?? "";
}

export function lookupHouse(sign: Sign, houseNumber: number): string {
  return contentLibrary[sign]?.houses?.[houseNumber] ?? "";
}
`;
}

function main() {
  const raw = fs.readFileSync(INPUT, "utf-8");
  const lib = parse(raw);

  // Report coverage so we can tell Marie which combinations are empty.
  const coverage = {
    signs: SIGNS.length,
    totalPlanetBlocks: 0,
    filledPlanetBlocks: 0,
    totalHouseBlocks: 0,
    filledHouseBlocks: 0,
    gaps: [] as string[],
  };
  for (const sign of SIGNS) {
    for (const p of PLANET_KEYS) {
      coverage.totalPlanetBlocks++;
      const text = lib[sign].planets[p];
      if (text && text.length > 20) {
        coverage.filledPlanetBlocks++;
      } else {
        coverage.gaps.push(`${sign} > ${p}`);
      }
    }
    for (let h = 1; h <= 12; h++) {
      coverage.totalHouseBlocks++;
      const text = lib[sign].houses[h];
      if (text && text.length > 20) {
        coverage.filledHouseBlocks++;
      } else {
        coverage.gaps.push(`${sign} > Maison ${h}`);
      }
    }
  }

  fs.writeFileSync(OUTPUT, formatOutput(lib), "utf-8");

  console.log(`[parser] wrote ${OUTPUT}`);
  console.log(
    `[parser] planets: ${coverage.filledPlanetBlocks}/${coverage.totalPlanetBlocks} filled`,
  );
  console.log(
    `[parser] houses:  ${coverage.filledHouseBlocks}/${coverage.totalHouseBlocks} filled`,
  );
  console.log(`[parser] gaps (${coverage.gaps.length}):`);
  for (const gap of coverage.gaps.slice(0, 40)) console.log(`  - ${gap}`);
  if (coverage.gaps.length > 40) console.log(`  ... +${coverage.gaps.length - 40} more`);
}

main();
