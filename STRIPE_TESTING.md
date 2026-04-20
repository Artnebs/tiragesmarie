# Stripe Integration — End-to-End Testing Guide

## Prerequisites

- Stripe CLI installed: https://stripe.com/docs/stripe-cli
- Stripe test-mode keys from https://dashboard.stripe.com/test/apikeys
- A running MySQL database with migrations applied

## 1. Environment Variables

Create a `.env` file at the repo root (never commit this file):

```
DATABASE_URL=mysql://user:password@localhost:3306/tiragesmarie
JWT_SECRET=any-random-string-for-dev
STRIPE_SECRET_KEY=sk_test_...       # from Stripe dashboard
STRIPE_WEBHOOK_SECRET=whsec_...     # obtained in step 3 below
OAUTH_SERVER_URL=https://your-oauth-server   # optional for payment testing
```

## 2. Apply Migrations

Run all migrations against your local database before starting:

```bash
pnpm db:push
```

Migration `drizzle/0003_stripe_unique_fix.sql` must run to allow null `stripePaymentIntentId`
and enforce `stripeSessionId` as unique.

## 3. Start the Stripe CLI Listener

In a separate terminal, start the Stripe webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Stripe CLI will print a webhook signing secret (`whsec_...`). Copy it into your `.env`
as `STRIPE_WEBHOOK_SECRET`, then restart the server.

## 4. Start the Development Server

```bash
pnpm dev
```

Server will start on http://localhost:3000.

## 5. Test a Full Checkout Flow (browser)

1. Navigate to http://localhost:3000/booklet
2. Fill in the form (use any valid test data)
3. Click "Commander mon livret — 49 €"
4. You will be redirected to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`, any future expiry, any CVC
6. On success, you land on `/payment-success?session_id=cs_test_...`
7. The page polls `trpc.stripe.getPaymentStatus` until status is `succeeded`

## 6. Test via Stripe CLI Trigger

You can simulate events without going through the browser:

```bash
# Simulate a completed checkout
stripe trigger checkout.session.completed
```

Expected DB state after `checkout.session.completed`:
- `stripe_payments.status` = `succeeded`
- `stripe_payments.stripePaymentIntentId` populated with the PI id
- `booklet_requests.status` = `generated` (for booklet product)
- `appointments.status` = `confirmed` (for appointment product)

```bash
# Simulate a refund
stripe trigger charge.refunded
```

Expected DB state:
- `stripe_payments.status` = `refunded`

## 7. Verify the Webhook Endpoint Directly

```bash
# No signature — expect 400 or 503
curl -X POST http://localhost:3000/api/stripe/webhook
# → 503 when STRIPE_WEBHOOK_SECRET is not set
# → 400 when set but no signature header

# Root health check — expect 200
curl http://localhost:3000/
```

## 8. Success / Cancel Page URLs

| Page           | URL                                       |
|----------------|-------------------------------------------|
| Success        | `/payment-success?session_id={SESSION_ID}` |
| Cancel         | `/payment-cancel`                          |

## 9. Cancellation

Use test card `4000 0000 0000 0002` in Stripe Checkout to trigger a card decline.
Or simply click "Back" in the Stripe Checkout UI — you will land on `/payment-cancel`.

Expected DB state for an expired session:
- `stripe_payments.status` = `cancelled`

## 10. Key Stripe Test Cards

| Card Number            | Behaviour                |
|------------------------|--------------------------|
| 4242 4242 4242 4242    | Success                  |
| 4000 0000 0000 0002    | Card declined            |
| 4000 0025 0000 3155    | Requires authentication  |
