/**
 * Stripe Payment Router
 * Gère les paiements pour livrets et rendez-vous
 */

import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import {
  createStripePayment,
  getStripePaymentByIntentId,
  getStripePaymentsByBookletRequest,
  getStripePaymentsByAppointment,
} from "./db";
import { STRIPE_PRODUCTS } from "./stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// ============================================================================
// CHECKOUT PROCEDURES
// ============================================================================

export const stripeRouter = router({
  /**
   * Créer une session de checkout pour un livret astral
   */
  createBookletCheckout: publicProcedure
    .input(
      z.object({
        bookletRequestId: z.number(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const product = STRIPE_PRODUCTS.booklet;

        // Créer une session de checkout Stripe
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: input.email,
          client_reference_id: input.bookletRequestId.toString(),
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.priceInCents,
              },
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/payment-cancel`,
          metadata: {
            bookletRequestId: input.bookletRequestId.toString(),
            customerName: `${input.firstName} ${input.lastName}`,
            productType: "booklet",
          },
        });

        // Créer un enregistrement de paiement en attente
        await createStripePayment({
          stripePaymentIntentId: session.payment_intent?.toString() || "",
          stripeSessionId: session.id,
          bookletRequestId: input.bookletRequestId,
          amount: product.priceInCents,
          currency: product.currency,
          productType: "booklet",
          status: "pending",
          customerEmail: input.email,
          customerName: `${input.firstName} ${input.lastName}`,
        });

        return {
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[Stripe] Error creating checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Créer une session de checkout pour un rendez-vous
   */
  createAppointmentCheckout: publicProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const product = STRIPE_PRODUCTS.appointment;

        // Créer une session de checkout Stripe
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: input.email,
          client_reference_id: input.appointmentId.toString(),
          line_items: [
            {
              price_data: {
                currency: product.currency,
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.priceInCents,
              },
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/payment-cancel`,
          metadata: {
            appointmentId: input.appointmentId.toString(),
            customerName: `${input.firstName} ${input.lastName}`,
            productType: "appointment",
          },
        });

        // Créer un enregistrement de paiement en attente
        await createStripePayment({
          stripePaymentIntentId: session.payment_intent?.toString() || "",
          stripeSessionId: session.id,
          appointmentId: input.appointmentId,
          amount: product.priceInCents,
          currency: product.currency,
          productType: "appointment",
          status: "pending",
          customerEmail: input.email,
          customerName: `${input.firstName} ${input.lastName}`,
        });

        return {
          success: true,
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[Stripe] Error creating checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Récupérer le statut d'un paiement
   */
  getPaymentStatus: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);

        return {
          status: session.payment_status,
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
          amountTotal: session.amount_total,
          currency: session.currency,
        };
      } catch (error) {
        console.error("[Stripe] Error retrieving session:", error);
        throw new Error("Failed to retrieve payment status");
      }
    }),

  /**
   * Récupérer les paiements d'une demande de livret
   */
  getBookletPayments: protectedProcedure
    .input(z.object({ bookletRequestId: z.number() }))
    .query(async ({ input }) => {
      return getStripePaymentsByBookletRequest(input.bookletRequestId);
    }),

  /**
   * Récupérer les paiements d'un rendez-vous
   */
  getAppointmentPayments: protectedProcedure
    .input(z.object({ appointmentId: z.number() }))
    .query(async ({ input }) => {
      return getStripePaymentsByAppointment(input.appointmentId);
    }),
});
