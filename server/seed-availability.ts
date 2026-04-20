/**
 * seed-availability.ts
 * Idempotent seed for Marie's default weekly availability rules.
 *
 * Run via: pnpm seed:availability
 *
 * Rules sourced from the static availability section that was in Booking.tsx:
 *   Monday     14:00–19:00
 *   Tuesday    10:00–17:00
 *   Wednesday  14:00–19:00
 *   Thursday   10:00–17:00
 *   Friday     14:00–19:00
 *   Saturday   10:00–14:00
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { availabilityRules } from "../drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("[seed] DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

const DEFAULT_RULES: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  isActive: number;
}[] = [
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  { dayOfWeek: 1, startTime: "14:00", endTime: "19:00", slotDurationMin: 90, isActive: 1 },
  { dayOfWeek: 2, startTime: "10:00", endTime: "17:00", slotDurationMin: 90, isActive: 1 },
  { dayOfWeek: 3, startTime: "14:00", endTime: "19:00", slotDurationMin: 90, isActive: 1 },
  { dayOfWeek: 4, startTime: "10:00", endTime: "17:00", slotDurationMin: 90, isActive: 1 },
  { dayOfWeek: 5, startTime: "14:00", endTime: "19:00", slotDurationMin: 90, isActive: 1 },
  { dayOfWeek: 6, startTime: "10:00", endTime: "14:00", slotDurationMin: 90, isActive: 1 },
];

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

async function seed() {
  console.log("[seed] Starting availability rules seed...");

  for (const rule of DEFAULT_RULES) {
    // Idempotency: check if a rule already exists for this dayOfWeek + startTime
    const existing = await db
      .select({ id: availabilityRules.id })
      .from(availabilityRules)
      .where(
        and(
          eq(availabilityRules.dayOfWeek, rule.dayOfWeek),
          eq(availabilityRules.startTime, rule.startTime)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log(
        `[seed] ${DAY_NAMES[rule.dayOfWeek]} ${rule.startTime}–${rule.endTime} already exists (id=${existing[0].id}), skipping.`
      );
    } else {
      const result = await db.insert(availabilityRules).values(rule);
      console.log(
        `[seed] Inserted ${DAY_NAMES[rule.dayOfWeek]} ${rule.startTime}–${rule.endTime} (id=${result[0].insertId}).`
      );
    }
  }

  console.log("[seed] Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Error:", err);
  process.exit(1);
});
