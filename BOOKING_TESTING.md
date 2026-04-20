# Booking System — Testing Guide (Phase 2C)

## Overview

Phase 2C replaces the Calendly embed with a fully internal slot-based booking
system. Marie's weekly availability is stored in `availability_rules`; one-off
blocks (vacations) live in `availability_blocks`. The `/booking` route now shows
a calendar picker, real-time slot buttons, and a contact form.

---

## 1. Prerequisites

- MySQL/MariaDB database running and accessible.
- `.env` file at repo root:

```
DATABASE_URL=mysql://user:pass@host:3306/tiragesmarie
JWT_SECRET=any-secret
NODE_ENV=development
```

---

## 2. Database migration

Apply migration `0004_booking_availability.sql` (two new tables + index):

```bash
# Option A — drizzle-kit
DATABASE_URL=mysql://... pnpm db:push

# Option B — manual
mysql -u user -p tiragesmarie < drizzle/0004_booking_availability.sql
```

Tables created:
- `availability_rules` — weekly recurrence rules
- `availability_blocks` — one-off blocked windows
- Index `appointments_appointmentDate_idx` on `appointments.appointmentDate`

---

## 3. Seed default availability

```bash
pnpm seed:availability
```

Expected output (first run):

```
[seed] Inserted Lundi 14:00–19:00 (id=1).
[seed] Inserted Mardi 10:00–17:00 (id=2).
[seed] Inserted Mercredi 14:00–19:00 (id=3).
[seed] Inserted Jeudi 10:00–17:00 (id=4).
[seed] Inserted Vendredi 14:00–19:00 (id=5).
[seed] Inserted Samedi 10:00–14:00 (id=6).
[seed] Done.
```

Second run (idempotency check):

```
[seed] Lundi 14:00–19:00 already exists (id=1), skipping.
… (all 6 lines say "already exists")
[seed] Done.
```

---

## 4. Dev server

```bash
NODE_ENV=development JWT_SECRET=dev DATABASE_URL=mysql://... pnpm dev
```

Server boots without crash. Visit http://localhost:5173/booking.

---

## 5. End-to-end booking flow

### 5.1 Calendar loads

1. Open `/booking`.
2. Confirm the day-picker calendar renders within the page.
3. Days before today and after today+56 days must be disabled (greyed out).

### 5.2 Slot picker

1. Click a weekday within the allowed range that has availability rules.
   - Monday, Tuesday, Wednesday, Thursday, Friday, Saturday all have rules.
   - Sunday has no rules — must show "Aucun créneau disponible ce jour."
2. Slot buttons appear (e.g. "14:00", "15:30", "17:00" for Monday).
3. Clicking a slot button highlights it in the accent color and reveals the
   contact form below.

### 5.3 Contact form submission

1. With a slot selected, fill firstName, lastName, email.
2. Submit.
3. Expected: confirmation screen appears with "Votre créneau est pré-réservé,
   nous vous confirmerons par email."
4. In the DB: `SELECT * FROM appointments ORDER BY id DESC LIMIT 1;`
   — confirms a new row with `status='pending'` and the correct `appointmentDate`.

### 5.4 Double-booking prevention

1. Note the ISO datetime of the slot you just booked.
2. Reload `/booking`, select the same day, verify the booked slot is **absent**
   from the slot grid (it will not appear since `getAvailableSlots` excludes
   pending/confirmed appointments).
3. Alternatively, call the API directly:

```bash
# POST to /trpc/appointment.create with the same appointmentDate
# Expected: HTTP 409, body contains "Créneau déjà réservé"
```

### 5.5 Double-submit race condition test

Using two browser tabs simultaneously, pick the same slot in both, then submit
both forms quickly. One will succeed; the other will receive a CONFLICT error
(not a 500), and the UI will display a toast asking the user to pick another slot.

---

## 6. Admin procedures (requires admin JWT)

All admin procedures under `trpc.availability.*`:

| Procedure | Action |
|-----------|--------|
| `createRule` | Add a new weekly rule |
| `updateRule` | Edit an existing rule |
| `deleteRule` | Soft-delete (sets isActive=0) |
| `blockRange` | Block a datetime range (vacation etc.) |

---

## 7. Merge hazards for other agents

### `server/routers.ts`
- **Lines 1-5 (imports)**: Added `TRPCError`, `availabilityRouter`,
  `isValidSlotStart`, `isSlotTaken`. Stripe agent imports will be in a
  separate block — merge should be clean.
- **Lines 127-178 (`appointmentRouter.create` body)**: Added ~20 lines of
  conflict/slot-alignment checks *before* the existing `createAppointment`
  call. The Email agent (notification body) touches lines *after* the
  `createAppointment` call. Merge conflict risk: LOW if Email agent only appends
  to the notification block.
- **Line 415 (`appRouter`)**: Added `availability: availabilityRouter` key.
  Stripe agent adds a `stripe` key. These are independent keys — no conflict.

### `drizzle/schema.ts`
- Added two new table definitions at the *end* of the file (lines 272–305).
  No existing table was modified. Stripe agent touches `stripePayments` table
  (already present, unmodified). Merge conflict risk: NONE.

### Migration numbering
- This agent uses `0004_*`. Stripe agent uses `0003_*`.
  No collision.
