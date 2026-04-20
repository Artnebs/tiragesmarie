/**
 * availability-router.ts
 * tRPC router for slot generation and availability management.
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, adminProcedure, router } from "./_core/trpc";
import {
  getActiveRules,
  getAllRules,
  insertRule,
  updateRule,
  deleteRule,
  insertBlock,
  getBlocksInRange,
  getConflictingAppointments,
} from "./availability-db";

// ─── Slot generation helpers ───────────────────────────────────────────────

/**
 * Parse "HH:MM" into { hours, minutes }.
 */
function parseTime(hhmm: string): { hours: number; minutes: number } {
  const [h, m] = hhmm.split(":").map(Number);
  return { hours: h, minutes: m };
}

/**
 * Set HH:MM on a Date (UTC) — returns a new Date.
 */
function setTimeUTC(base: Date, hhmm: string): Date {
  const d = new Date(base);
  const { hours, minutes } = parseTime(hhmm);
  d.setUTCHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Check whether a slot [slotStart, slotEnd) overlaps an existing block window.
 */
function overlapsBlock(
  slotStart: Date,
  slotEnd: Date,
  blockStart: Date,
  blockEnd: Date
): boolean {
  return slotStart < blockEnd && slotEnd > blockStart;
}

export interface Slot {
  start: string; // ISO 8601 UTC
  end: string;
}

/**
 * Generate available slots for a single calendar day.
 * All times are interpreted as UTC (stored UTC in DB; Paris display is frontend responsibility).
 */
function generateSlotsForDay(
  date: Date,
  startTime: string,
  endTime: string,
  slotDurationMin: number,
  blocks: { startAt: Date; endAt: Date }[],
  takenSlots: Set<number>, // Date.getTime() of taken slot starts
  nowBuffer: Date
): Slot[] {
  const dayStart = setTimeUTC(date, startTime);
  const dayEnd = setTimeUTC(date, endTime);
  const slots: Slot[] = [];

  let cursor = new Date(dayStart);
  while (cursor < dayEnd) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + slotDurationMin * 60 * 1000);

    if (slotEnd > dayEnd) break;

    // Skip past slots
    if (slotStart <= nowBuffer) {
      cursor = slotEnd;
      continue;
    }

    // Skip if taken by an existing appointment
    if (takenSlots.has(slotStart.getTime())) {
      cursor = slotEnd;
      continue;
    }

    // Skip if overlaps any availability block
    const blocked = blocks.some((b) =>
      overlapsBlock(slotStart, slotEnd, b.startAt, b.endAt)
    );
    if (blocked) {
      cursor = slotEnd;
      continue;
    }

    slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
    cursor = slotEnd;
  }

  return slots;
}

/**
 * Validate that a given ISO datetime string falls exactly on a valid slot start.
 * Returns true if valid, false otherwise.
 */
export async function isValidSlotStart(isoDatetime: string): Promise<boolean> {
  const target = new Date(isoDatetime);
  if (isNaN(target.getTime())) return false;

  const rules = await getActiveRules();
  const dayOfWeek = target.getUTCDay();

  for (const rule of rules) {
    if (rule.dayOfWeek !== dayOfWeek) continue;

    const dayStart = setTimeUTC(target, rule.startTime);
    const dayEnd = setTimeUTC(target, rule.endTime);

    if (target < dayStart || target >= dayEnd) continue;

    // Check alignment: (target - dayStart) must be a multiple of slotDurationMin
    const diffMs = target.getTime() - dayStart.getTime();
    const diffMin = diffMs / 60000;
    if (diffMin % rule.slotDurationMin === 0) return true;
  }

  return false;
}

// ─── Router ────────────────────────────────────────────────────────────────

export const availabilityRouter = router({
  /**
   * PUBLIC — return available slots in [from, to].
   * Maximum range: 60 days.
   */
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        from: z.string().datetime(),
        to: z.string().datetime(),
      })
    )
    .query(async ({ input }) => {
      const from = new Date(input.from);
      const to = new Date(input.to);

      const rangeDays =
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
      if (rangeDays > 60) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La plage demandée dépasse 60 jours.",
        });
      }
      if (from >= to) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "La date de début doit être avant la date de fin.",
        });
      }

      const rules = await getActiveRules();
      const blocks = await getBlocksInRange(from, to);
      const takenRows = await getConflictingAppointments(from, to);
      const takenSet = new Set(
        takenRows.map((a) => new Date(a.appointmentDate).getTime())
      );

      // 2-hour buffer from now
      const nowBuffer = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const slots: Slot[] = [];

      // Iterate each day in the range
      let cursor = new Date(from);
      cursor.setUTCHours(0, 0, 0, 0);

      while (cursor <= to) {
        const dow = cursor.getUTCDay();
        const dayRules = rules.filter((r) => r.dayOfWeek === dow);

        for (const rule of dayRules) {
          const daySlots = generateSlotsForDay(
            cursor,
            rule.startTime,
            rule.endTime,
            rule.slotDurationMin,
            blocks.map((b) => ({
              startAt: new Date(b.startAt),
              endAt: new Date(b.endAt),
            })),
            takenSet,
            nowBuffer
          );
          slots.push(...daySlots);
        }

        // Advance to next day
        cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
      }

      return slots;
    }),

  /**
   * PUBLIC — active rules for UI display.
   */
  listRules: publicProcedure.query(async () => {
    return getActiveRules();
  }),

  // ── Admin procedures ────────────────────────────────────────────────────

  createRule: adminProcedure
    .input(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
        slotDurationMin: z.number().int().min(15).max(480).default(90),
        isActive: z.number().int().min(0).max(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      return insertRule(input);
    }),

  updateRule: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        dayOfWeek: z.number().int().min(0).max(6).optional(),
        startTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/)
          .optional(),
        endTime: z
          .string()
          .regex(/^\d{2}:\d{2}$/)
          .optional(),
        slotDurationMin: z.number().int().min(15).max(480).optional(),
        isActive: z.number().int().min(0).max(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateRule(id, data);
      return { success: true };
    }),

  deleteRule: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await deleteRule(input.id);
      return { success: true };
    }),

  blockRange: adminProcedure
    .input(
      z.object({
        startAt: z.string().datetime(),
        endAt: z.string().datetime(),
        reason: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const block = await insertBlock({
        startAt: new Date(input.startAt),
        endAt: new Date(input.endAt),
        reason: input.reason,
      });
      return block;
    }),
});
