## Email System — Testing Guide

### Environment variables

Add these to your `.env` (never commit real values):

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev          # use for dev; replace with validated domain in prod
OWNER_EMAIL=marie@tiragesmarie.fr         # admin recipient
APP_URL=http://localhost:3000             # used in admin links inside templates
```

**Note on FROM_EMAIL in production:** Resend free tier requires a DNS-validated sending domain.
Until your domain is verified, use `onboarding@resend.dev` for sandbox testing — Resend routes all
outbound to your account's verified email regardless of the `to` address.

### Local template preview

Start the React Email dev server (renders templates in the browser with hot reload):

```bash
pnpm email:dev
# Opens http://localhost:3000 (or next available port)
```

Templates live in `server/emails/`. Each `.tsx` file appears as a separate preview tab.

### Triggering a real send (development)

1. Start the API server:

   ```bash
   pnpm dev
   ```

2. With a valid `RESEND_API_KEY` and a working `DATABASE_URL`, submit the booklet form at
   `http://localhost:3000` — this fires the `booklet.create` tRPC mutation which sends:
   - `BookletRequestCustomer` to the submitted email address
   - `BookletRequestAdmin` to `OWNER_EMAIL`

3. For appointments, use the appointment booking form — same pattern.

### Missing key fallback

When `RESEND_API_KEY` is empty or unset, the server starts normally and mutations still succeed.
You will see console output like:

```
[email] RESEND_API_KEY is not set — email delivery disabled
[email] Resend unavailable — would have sent "Votre demande de livret..." to user@example.com
[Notification][stub] Nouvelle demande de livret — Jean Dupont a demandé...
```

No emails are delivered and no errors are returned to the client.

### Delivery logs

After a real send, check the Resend dashboard at https://resend.com/emails.
Each delivery returns an `id` field logged to stdout:

```
[email] Delivered "Votre demande de livret..." to user@example.com (id: abc123...)
```

### Templates reference

| File | Recipient | Trigger |
|---|---|---|
| `BookletRequestCustomer.tsx` | Customer | `booklet.create` |
| `BookletRequestAdmin.tsx` | Marie (OWNER_EMAIL) | `booklet.create` |
| `AppointmentCustomer.tsx` | Customer | `appointment.create` |
| `AppointmentAdmin.tsx` | Marie (OWNER_EMAIL) | `appointment.create` |
| `PaymentSuccessCustomer.tsx` | Customer | Stripe webhook (Phase 2C) |

`PaymentSuccessCustomer` is not wired to a router yet — it will be called from the Stripe webhook
handler when that phase is implemented.
