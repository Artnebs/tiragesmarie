# Deploy — Les Tirages de Marie → zeworkshop.com/tirages-marie/

First-time deploy runbook. Follow steps in order. Each step has a done-state you can verify before moving on.

---

## Overview

Architecture:
- Single Vercel project (`tirages-marie`) serves both the static Vite client and all `/api/*` serverless functions.
- Deploy URL: `https://tirages-marie.vercel.app`
- Public URL (after root project rewrite): `https://zeworkshop.com/tirages-marie/`
- MySQL: TiDB Cloud Serverless (free tier, MySQL-wire-compatible, works with Drizzle mysql2 dialect)
- Stripe: test mode only (`sk_test_...` key)
- Resend: sandbox/test mode (FROM_EMAIL = `onboarding@resend.dev` until domain is verified)

---

## Step 1 — Provision MySQL (TiDB Cloud Serverless)

**Why TiDB Cloud:** free forever, 5 GiB storage, MySQL wire protocol, no credit card required for free tier.

1. Go to https://tidbcloud.com and sign up (GitHub SSO is fastest).
2. Create a new cluster → choose **Serverless** tier → region EU (Frankfurt) for latency.
3. In the cluster panel → **Connect** → select **General** → copy the connection string.
   It will look like:
   ```
   mysql://user:password@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}
   ```
4. Rename the database from `test` to `tirages_marie` in the TiDB Cloud console
   (Databases → Create Database → `tirages_marie`).
5. Update your connection string to use `tirages_marie` instead of `test`.

**Done state:** You can connect with `mysql2` from your machine using the connection string.

---

## Step 2 — Run Drizzle Migrations Locally

From your machine (not Vercel — migrations run locally against the remote DB):

```bash
cd ~/tiragesmarie
DATABASE_URL="<your-tidb-connection-string>" pnpm tsx scripts/migrate-workshop.ts
```

This applies all 5 migrations in order (0000 → 0004) and creates the `__drizzle_migrations` tracking table.

**Done state:** No error output. TiDB Cloud console shows the tables: `users`, `booklet_requests`, `appointments`, `blog_articles`, `blog_categories`, `blog_tags`, `astro_signs`, `astro_planets`, `astro_houses`, `generated_booklets`, `stripe_payments`, `appointment_slots`.

---

## Step 3 — Create the Vercel Project

```bash
cd ~/tiragesmarie
vercel link   # or: vercel projects create tirages-marie
```

If creating fresh:
- Project name: `tirages-marie`
- Framework preset: **Other** (not Vite — we use `framework: null` in vercel.json)
- Root directory: `.` (repo root)

**Done state:** `vercel link` succeeds and `.vercel/project.json` exists locally.

---

## Step 4 — Set Environment Variables in Vercel

Go to https://vercel.com/dashboard → project `tirages-marie` → **Settings → Environment Variables**.

Set the following for **Production** (and Preview if you want preview deploys to work):

### Required to boot

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `mysql://user:pass@host:4000/tirages_marie?ssl={"rejectUnauthorized":true}` | From TiDB Cloud step 1 |
| `JWT_SECRET` | 64-char random string | Generate: `openssl rand -hex 32` |
| `ADMIN_PASSWORD` | Strong password for Marie's admin login | Your choice |
| `NODE_ENV` | `production` | |
| `WORKSHOP_MODE` | `true` | Enables live-key safety guard |

### Required for Vite client (sub-path routing)

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_BASE_PATH` | `/tirages-marie/` | Trailing slash required |

### Required for Stripe (test mode)

| Variable | Value | Notes |
|----------|-------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | From Stripe dashboard → test mode |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From step 6 below |

### Required for Resend (test/sandbox)

| Variable | Value | Notes |
|----------|-------|-------|
| `RESEND_API_KEY` | `re_...` | From resend.com dashboard |
| `FROM_EMAIL` | `onboarding@resend.dev` | Resend sandbox sender — no domain setup needed |
| `OWNER_EMAIL` | `marie@lestiragesdemarie.fr` (or your test address) | Where admin notifications go |

### Optional / legacy (can be left blank for workshop)

| Variable | Value | Notes |
|----------|-------|-------|
| `BUILT_IN_FORGE_API_URL` | (blank) | Only used by storage.ts helper — not in active routes |
| `BUILT_IN_FORGE_API_KEY` | (blank) | Same |
| `OAUTH_SERVER_URL` | (blank) | Removed OAuth flow — not used |
| `OWNER_OPEN_ID` | (blank) | Unused in password-auth mode |
| `VITE_APP_ID` | (blank) | Unused in current code |

**Done state:** All required variables show green in Vercel dashboard.

---

## Step 5 — First Deploy

```bash
cd ~/tiragesmarie

# Build locally first to catch errors before wasting Vercel minutes
VITE_BASE_PATH=/tirages-marie/ pnpm build

# Deploy to Vercel production
vercel deploy --prod
```

Watch the build log. The Vite build must complete cleanly. The function `api/index.ts` must appear in the function list.

**Done state:** Vercel dashboard shows deployment as **Ready**. Visit `https://tirages-marie.vercel.app` — the app loads (may redirect to home page with `/tirages-marie/` base).

---

## Step 6 — Register Stripe Test Webhook

1. Go to https://dashboard.stripe.com (make sure you're in **test mode** — toggle top-left).
2. Developers → Webhooks → **Add endpoint**.
3. Endpoint URL:
   ```
   https://zeworkshop.com/tirages-marie/api/stripe/webhook
   ```
   (Or use `https://tirages-marie.vercel.app/api/stripe/webhook` until the rewrite is live.)
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
5. Save → copy the **Signing secret** (`whsec_...`).
6. Go back to Vercel → Environment Variables → set `STRIPE_WEBHOOK_SECRET` to that value.
7. Redeploy: `vercel deploy --prod` (needed to pick up the new env var).

**Done state:** Stripe dashboard shows webhook endpoint as active. Test with Stripe CLI:
```bash
stripe trigger checkout.session.completed --webhook-endpoint=<endpoint-id>
```

---

## Step 7 — Wire Rewrite in Root Vercel Project

On your host machine (NOT this repo — this is the `~/ze_work_shop/` root project):

In `~/ze_work_shop/vercel.json`, add to the `rewrites` array:
```json
{
  "source": "/tirages-marie/:path*",
  "destination": "https://tirages-marie.vercel.app/:path*"
}
```

Then deploy the root project:
```bash
cd ~/ze_work_shop
vercel deploy --prod
```

**Done state:** `https://zeworkshop.com/tirages-marie/` loads the app. All routes (`/tirages-marie/booking`, `/tirages-marie/admin/login`, etc.) work.

---

## Step 8 — Smoke Test the Booking Flow

Follow the full playbook in `BOOKING_TESTING.md`. At minimum:

1. Visit `https://zeworkshop.com/tirages-marie/`
2. Navigate to `/booklet` — fill in a test booklet request.
3. Proceed to Stripe checkout — use test card `4242 4242 4242 4242`.
4. Verify redirect to `/payment-success`.
5. Log in as admin at `/admin/login`.
6. Check that the booklet request appears in the admin dashboard.
7. Check that the Stripe payment row is `succeeded` in the admin panel.
8. (Optional) Trigger PDF generation from the admin panel and verify the download link works.

---

## Known Limitations for Workshop Deployment

- **PDF files are ephemeral on Vercel.** The booklet generator writes PDFs to `/tmp/generated-livrets/` inside the serverless function. This directory is wiped between cold starts. For production use, the booklet pipeline should write to S3 (bucket `tirages-marie-workshop`). The code already supports this via `storage.ts` but it is not wired to the booklet generator yet — that is a post-workshop task.
- **No custom domain on the Vercel project itself.** Traffic arrives via the zeworkshop.com rewrite. The Vercel project URL (`tirages-marie.vercel.app`) is the origin; HTTPS is handled by Vercel automatically.
- **Stripe is test mode only.** `WORKSHOP_MODE=true` plus the startup guard in `server/_core/app.ts` prevents accidental live charges. Do not replace `sk_test_...` with `sk_live_...` until the site is ready for real transactions.
- **Resend sandbox.** `FROM_EMAIL=onboarding@resend.dev` means emails deliver to your Resend dashboard only (not to real inboxes unless the recipient address is verified in your Resend account). Swap to a verified custom domain sender before going live.

---

## Rollback

If the Vercel deployment breaks:
```bash
vercel rollback --token=$VERCEL_TOKEN
```

If the DB migration corrupts data (unlikely — migrations are additive):
- TiDB Cloud has point-in-time recovery on paid tiers.
- On free tier: re-run `migrate-workshop.ts` after dropping and recreating the database.
