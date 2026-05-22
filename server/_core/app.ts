/**
 * Express app factory — shared between local dev server and Vercel serverless.
 *
 * Rules:
 * - No app.listen() here. The caller (index.ts for local, api/[...path].ts for
 *   Vercel) is responsible for binding the port or exporting the handler.
 * - No import of vite.ts — Vite middleware is only wired in local dev via index.ts.
 * - PDF booklet downloads stream from /tmp when VERCEL=1 (writable Vercel scratch
 *   dir), or from generated-livrets/ locally.
 *
 * WORKSHOP_MODE safety:
 * - Set WORKSHOP_MODE=true in Vercel env for the workshop deployment.
 * - When active, the app refuses to start if STRIPE_SECRET_KEY looks like a
 *   live key (sk_live_...) so a misconfigured env cannot accidentally charge
 *   real customers.
 */

import express, { type Request, type Response } from "express";
import path from "node:path";
import fs from "node:fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { stripeWebhookHandler } from "../stripe-webhook";
import { readSessionCookie, verifyAdminCookie } from "./admin-auth";

/**
 * Startup safety check — called once when the function cold-starts on Vercel.
 * Throws if a live Stripe key is present while WORKSHOP_MODE=true.
 */
function assertWorkshopSafety() {
  if (process.env.WORKSHOP_MODE !== "true") return;

  const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (stripeKey.startsWith("sk_live_")) {
    throw new Error(
      "[WORKSHOP_MODE] Live Stripe key detected. " +
      "Set STRIPE_SECRET_KEY to a test key (sk_test_...) for the workshop deployment. " +
      "Refusing to start to prevent accidental live charges.",
    );
  }

  const resendKey = process.env.RESEND_API_KEY ?? "";
  // Resend does not prefix test vs live keys visually, but we warn loudly.
  if (resendKey && !process.env.FROM_EMAIL?.includes("resend.dev") && !process.env.FROM_EMAIL?.includes("onboarding@resend.dev")) {
    console.warn(
      "[WORKSHOP_MODE] FROM_EMAIL is not a Resend sandbox address. " +
      "Emails will be delivered to real recipients. " +
      "Set FROM_EMAIL=onboarding@resend.dev to suppress delivery during testing.",
    );
  }
}

export function createApp() {
  assertWorkshopSafety();

  const app = express();

  // ── Stripe webhook — raw body MUST arrive before express.json() ──────────
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookHandler,
  );

  // ── Body parsers ──────────────────────────────────────────────────────────
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ── Auth routes ───────────────────────────────────────────────────────────
  registerAuthRoutes(app);

  // ── Booklet PDF downloads — admin-gated ───────────────────────────────────
  // On Vercel the writable scratch dir is /tmp.  Locally it is generated-livrets/.
  const LIVRETS_DIR = process.env.VERCEL
    ? "/tmp/generated-livrets"
    : path.resolve(process.cwd(), "generated-livrets");

  app.get(
    "/api/booklets/file/:filename",
    async (req: Request, res: Response) => {
      const user = await verifyAdminCookie(readSessionCookie(req));
      if (!user || user.role !== "admin") {
        res.status(403).json({ error: "forbidden" });
        return;
      }
      const filename = path.basename(req.params.filename);
      const abs = path.join(LIVRETS_DIR, filename);
      if (!abs.startsWith(LIVRETS_DIR) || !fs.existsSync(abs)) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${filename}"`,
      );
      fs.createReadStream(abs).pipe(res);
    },
  );

  // ── tRPC ──────────────────────────────────────────────────────────────────
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext }),
  );

  return app;
}
