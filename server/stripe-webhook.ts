/**
 * Stripe Webhook Handler
 * Mounted BEFORE express.json() so that the raw body is preserved.
 *
 * Events handled:
 *   checkout.session.completed  → status = succeeded, update business row
 *   checkout.session.expired    → status = cancelled
 *   charge.refunded             → status = refunded
 */

import type { Request, Response } from "express";
import Stripe from "stripe";
import {
  getStripePaymentBySessionId,
  updateStripePaymentBySessionId,
  updateBookletRequestStatus,
  updateAppointmentStatus,
} from "./db";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Lazily initialised stripe client — only created when the webhook is actually called.
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  }
  return _stripe;
}

export async function stripeWebhookHandler(
  req: Request,
  res: Response
): Promise<void> {
  if (!WEBHOOK_SECRET) {
    console.warn(
      "[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not set — returning 503"
    );
    res.status(503).json({ error: "Webhook secret not configured" });
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      req.body as Buffer,
      signature,
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        // Update stripe_payments row
        await updateStripePaymentBySessionId(sessionId, {
          status: "succeeded",
          ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
        });

        // Retrieve the DB record for business-row references
        const dbPayment = await getStripePaymentBySessionId(sessionId);

        const productType = session.metadata?.productType;

        if (productType === "booklet" && dbPayment?.bookletRequestId) {
          // Keep booklet_requests.status enum intact (pending|generated|sent|completed).
          // Payment is tracked on stripe_payments; we advance the booklet to "generated"
          // so the admin knows it's paid and ready to process.
          await updateBookletRequestStatus(
            dbPayment.bookletRequestId,
            "generated"
          );
        } else if (productType === "appointment" && dbPayment?.appointmentId) {
          await updateAppointmentStatus(dbPayment.appointmentId, "confirmed");
        }

        console.info(
          `[Stripe Webhook] checkout.session.completed — session ${sessionId}, product ${productType}`
        );
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await updateStripePaymentBySessionId(session.id, {
          status: "cancelled",
        });
        console.info(
          `[Stripe Webhook] checkout.session.expired — session ${session.id}`
        );
        break;
      }

      case "charge.refunded": {
        // charge.refunded does not carry the checkout session id directly.
        // We match via payment_intent id stored on the payment record.
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id ?? null;

        if (paymentIntentId) {
          // Use drizzle to update by payment intent id — import helper inline
          const { getStripePaymentByIntentId, updateStripePaymentStatus } =
            await import("./db");
          const record = await getStripePaymentByIntentId(paymentIntentId);
          if (record) {
            await updateStripePaymentStatus(record.id, "refunded");
            console.info(
              `[Stripe Webhook] charge.refunded — payment ${record.id}`
            );
          }
        }
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Error processing event:", err);
    // Still return 200 to prevent Stripe from retrying an application-level error
    res.status(200).json({ received: true, warning: "Processing error logged" });
  }
}
