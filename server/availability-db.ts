/**
 * availability-db.ts
 * Low-level DB helpers for availability tables.
 * Kept separate from db.ts to minimise merge surface on that file.
 */

import { eq, and, lte, gte, inArray } from "drizzle-orm";
import { getDb } from "./db";
import {
  availabilityRules,
  availabilityBlocks,
  appointments,
  InsertAvailabilityRule,
  InsertAvailabilityBlock,
} from "../drizzle/schema";

// ─── Rules ─────────────────────────────────────────────────────────────────

export async function getActiveRules() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(availabilityRules)
    .where(eq(availabilityRules.isActive, 1));
}

export async function getAllRules() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(availabilityRules);
}

export async function insertRule(data: InsertAvailabilityRule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(availabilityRules).values(data);
  const id = Number(result[0].insertId);
  const rows = await db
    .select()
    .from(availabilityRules)
    .where(eq(availabilityRules.id, id))
    .limit(1);
  return rows[0];
}

export async function updateRule(
  id: number,
  data: Partial<InsertAvailabilityRule>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(availabilityRules)
    .set(data)
    .where(eq(availabilityRules.id, id));
}

export async function deleteRule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(availabilityRules)
    .set({ isActive: 0 })
    .where(eq(availabilityRules.id, id));
}

// ─── Blocks ────────────────────────────────────────────────────────────────

export async function insertBlock(data: InsertAvailabilityBlock) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(availabilityBlocks).values(data);
  const id = Number(result[0].insertId);
  const rows = await db
    .select()
    .from(availabilityBlocks)
    .where(eq(availabilityBlocks.id, id))
    .limit(1);
  return rows[0];
}

/**
 * Return all blocks whose window overlaps [from, to].
 */
export async function getBlocksInRange(from: Date, to: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // A block overlaps [from, to] if block.startAt < to AND block.endAt > from
  return db
    .select()
    .from(availabilityBlocks)
    .where(
      and(lte(availabilityBlocks.startAt, to), gte(availabilityBlocks.endAt, from))
    );
}

// ─── Appointments conflict check ───────────────────────────────────────────

/**
 * Return appointments in statuses pending/confirmed whose appointmentDate
 * falls inside [from, to].
 */
export async function getConflictingAppointments(from: Date, to: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(appointments)
    .where(
      and(
        inArray(appointments.status, ["pending", "confirmed"]),
        gte(appointments.appointmentDate, from),
        lte(appointments.appointmentDate, to)
      )
    );
}

/**
 * Check whether a single slot start time is already taken.
 */
export async function isSlotTaken(slotStart: Date): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        inArray(appointments.status, ["pending", "confirmed"]),
        eq(appointments.appointmentDate, slotStart)
      )
    )
    .limit(1);
  return rows.length > 0;
}
