import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { stripeRouter } from "./stripe-router";
import { z } from "zod";
import { availabilityRouter, isValidSlotStart } from "./availability-router";
import { isSlotTaken } from "./availability-db";
import {
  createBookletRequest,
  getBookletRequests,
  getBookletRequestById,
  updateBookletRequestStatus,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  createBlogArticle,
  getBlogArticles,
  getAllBlogArticles,
  getBlogArticleById,
  getBlogArticleBySlug,
  updateBlogArticle,
  deleteBlogArticle,
  searchBlogArticles,
  getAstroSigns,
  getAstroSignByName,
  getAstroPlanets,
  getAstroPlanetByName,
  getAstroHouses,
  getAstroHouseByNumber,
  createGeneratedBooklet,
  getGeneratedBookletById,
  updateGeneratedBooklet,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { sendEmail } from "./_core/email";
import BookletRequestCustomer from "./emails/BookletRequestCustomer";
import BookletRequestAdmin from "./emails/BookletRequestAdmin";
import AppointmentCustomer from "./emails/AppointmentCustomer";
import AppointmentAdmin from "./emails/AppointmentAdmin";
import React from "react";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const BookletRequestSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeOfBirth: z.string().regex(/^\d{2}:\d{2}$/),
  placeOfBirth: z.string().min(2).max(200),
  email: z.string().email().max(320),
  message: z.string().max(5000).optional(),
});

const AppointmentRequestSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(320),
  phone: z.string().max(20).optional(),
  appointmentDate: z.string().datetime(),
  message: z.string().max(5000).optional(),
});

const BlogArticleSchema = z.object({
  title: z.string().min(5).max(255),
  slug: z.string().min(5).max(255),
  content: z.string().min(50),
  excerpt: z.string().max(500).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.string().max(255).optional(),
  ogImage: z.string().max(500).optional(),
  categoryId: z.number().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

// ============================================================================
// BOOKLET PROCEDURES
// ============================================================================

const bookletRouter = router({
  create: publicProcedure
    .input(BookletRequestSchema)
    .mutation(async ({ input }) => {
      const request = await createBookletRequest({
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth as any,
        timeOfBirth: input.timeOfBirth as any,
        placeOfBirth: input.placeOfBirth,
        email: input.email,
        message: input.message,
        status: "pending",
      });

      // Notify owner (safety-net plain channel)
      await notifyOwner({
        title: "Nouvelle demande de livret",
        content: `${input.firstName} ${input.lastName} a demandé un livret astrologique. Email: ${input.email}`,
      });

      // Templated emails — fire-and-forget; never block the mutation
      const ownerEmail = process.env.OWNER_EMAIL ?? "";
      await Promise.allSettled([
        sendEmail({
          to: input.email,
          subject: "Votre demande de livret astrologique a bien été reçue",
          react: React.createElement(BookletRequestCustomer, {
            firstName: input.firstName,
            email: input.email,
            requestId: request.id,
          }),
        }),
        ...(ownerEmail
          ? [
              sendEmail({
                to: ownerEmail,
                subject: `Nouvelle demande de livret — ${input.firstName} ${input.lastName}`,
                react: React.createElement(BookletRequestAdmin, {
                  firstName: input.firstName,
                  lastName: input.lastName,
                  email: input.email,
                  dateOfBirth: input.dateOfBirth,
                  timeOfBirth: input.timeOfBirth,
                  placeOfBirth: input.placeOfBirth,
                  message: input.message,
                  requestId: request.id,
                }),
              }),
            ]
          : []),
      ]);

      return {
        success: true,
        requestId: request.id,
      };
    }),

  list: protectedProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return getBookletRequests(input.status, input.limit, input.offset);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getBookletRequestById(input.id);
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      await updateBookletRequestStatus(input.id, input.status);
      return { success: true };
    }),
});

// ============================================================================
// APPOINTMENT PROCEDURES
// ============================================================================

const appointmentRouter = router({
  create: publicProcedure
    .input(AppointmentRequestSchema)
    .mutation(async ({ input }) => {
      // ── Slot-alignment check ──────────────────────────────────────────────
      const validSlot = await isValidSlotStart(input.appointmentDate);
      if (!validSlot) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ce créneau n'est pas un créneau valide.",
        });
      }

      // ── Double-booking guard ──────────────────────────────────────────────
      const alreadyTaken = await isSlotTaken(new Date(input.appointmentDate));
      if (alreadyTaken) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Créneau déjà réservé",
        });
      }

      const appointment = await createAppointment({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        appointmentDate: new Date(input.appointmentDate),
        message: input.message,
        status: "pending",
      });

      // Notify owner (safety-net plain channel)
      await notifyOwner({
        title: "Nouvelle réservation de rendez-vous",
        content: `${input.firstName} ${input.lastName} a réservé un rendez-vous pour ${input.appointmentDate}. Email: ${input.email}`,
      });

      // Templated emails — fire-and-forget; never block the mutation
      const ownerEmailAppt = process.env.OWNER_EMAIL ?? "";
      const apptDate = new Date(input.appointmentDate);
      await Promise.allSettled([
        sendEmail({
          to: input.email,
          subject: "Votre demande de rendez-vous a bien été reçue",
          react: React.createElement(AppointmentCustomer, {
            firstName: input.firstName,
            appointmentDate: apptDate,
            message: input.message,
          }),
        }),
        ...(ownerEmailAppt
          ? [
              sendEmail({
                to: ownerEmailAppt,
                subject: `Nouveau rendez-vous — ${input.firstName} ${input.lastName}`,
                react: React.createElement(AppointmentAdmin, {
                  firstName: input.firstName,
                  lastName: input.lastName,
                  email: input.email,
                  phone: input.phone,
                  appointmentDate: apptDate,
                  message: input.message,
                  appointmentId: appointment.id,
                }),
              }),
            ]
          : []),
      ]);

      return {
        success: true,
        appointmentId: appointment.id,
      };
    }),

  list: protectedProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return getAppointments(input.status, input.limit, input.offset);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getAppointmentById(input.id);
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      await updateAppointmentStatus(input.id, input.status);
      return { success: true };
    }),
});

// ============================================================================
// BLOG PROCEDURES
// ============================================================================

const blogRouter = router({
  create: protectedProcedure
    .input(BlogArticleSchema)
    .mutation(async ({ input, ctx }) => {
      const article = await createBlogArticle({
        ...input,
        authorId: ctx.user.id,
        publishedAt: input.status === "published" ? new Date() : null,
      });
      return article;
    }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().default(12),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return getBlogArticles("published", input.limit, input.offset);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return getBlogArticleBySlug(input.slug);
    }),

  search: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return searchBlogArticles(input.query, input.limit);
    }),

  // ── Admin procedures ──────────────────────────────────────────────────
  listAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      return getAllBlogArticles(input.limit, input.offset);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getBlogArticleById(input.id);
    }),

  update: protectedProcedure
    .input(
      BlogArticleSchema.partial().extend({ id: z.number() }),
    )
    .mutation(async ({ input }) => {
      const { id, status, ...rest } = input;
      const patch: Record<string, unknown> = { ...rest };
      if (status !== undefined) {
        patch.status = status;
        // When flipping to published, stamp publishedAt if not already set.
        if (status === "published") {
          const current = await getBlogArticleById(id);
          if (current && !current.publishedAt) {
            patch.publishedAt = new Date();
          }
        }
      }
      const updated = await updateBlogArticle(id, patch as any);
      return updated;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteBlogArticle(input.id);
      return { success: true };
    }),
});

// ============================================================================
// ASTROLOGY CONTENT PROCEDURES
// ============================================================================

const astroRouter = router({
  getSigns: publicProcedure.query(async () => {
    return getAstroSigns();
  }),

  getSignByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return getAstroSignByName(input.name);
    }),

  getPlanets: publicProcedure.query(async () => {
    return getAstroPlanets();
  }),

  getPlanetByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return getAstroPlanetByName(input.name);
    }),

  getHouses: publicProcedure.query(async () => {
    return getAstroHouses();
  }),

  getHouseByNumber: publicProcedure
    .input(z.object({ houseNumber: z.number() }))
    .query(async ({ input }) => {
      return getAstroHouseByNumber(input.houseNumber);
    }),
});

// ============================================================================
// BOOKLET GENERATION PROCEDURES
// ============================================================================

const bookletGeneratorRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        bookletRequestId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const request = await getBookletRequestById(input.bookletRequestId);
      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Demande de livret introuvable",
        });
      }

      // 1) Compute the natal chart
      const { computeChart } = await import("./astro-engine");
      const toYMD = (d: Date | string) => {
        if (typeof d === "string") return d.slice(0, 10);
        return d.toISOString().slice(0, 10);
      };
      const toHM = (t: string | Date): string => {
        if (typeof t === "string") return t.slice(0, 5);
        return t.toISOString().slice(11, 16);
      };
      const chart = await computeChart({
        dateOfBirth: toYMD(request.dateOfBirth as any),
        timeOfBirth: toHM(request.timeOfBirth as any),
        placeOfBirth: request.placeOfBirth,
      });

      // 2) Assemble content from Marie's library
      const { assembleBooklet, findGaps } = await import("./booklet-assembly");
      const content = assembleBooklet(
        {
          firstName: request.firstName,
          lastName: request.lastName,
          dateOfBirth: toYMD(request.dateOfBirth as any),
          timeOfBirth: toHM(request.timeOfBirth as any),
          placeOfBirth: request.placeOfBirth,
          email: request.email,
        },
        chart,
      );

      // 3) Render to PDF
      const { renderBookletPDF } = await import("./booklet-pdf");
      const pdfBuffer = await renderBookletPDF(content);

      // 4) Persist to local disk (MVP; S3 later)
      const fs = await import("node:fs");
      const path = await import("node:path");
      const LIVRETS_DIR = path.resolve(process.cwd(), "generated-livrets");
      if (!fs.existsSync(LIVRETS_DIR)) {
        fs.mkdirSync(LIVRETS_DIR, { recursive: true });
      }
      const timestamp = Date.now();
      const slug = `${request.firstName}-${request.lastName}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `${slug}-${input.bookletRequestId}-${timestamp}.pdf`;
      const absPath = path.join(LIVRETS_DIR, filename);
      fs.writeFileSync(absPath, pdfBuffer);
      const documentUrl = `/api/booklets/file/${encodeURIComponent(filename)}`;

      // 5) Upsert the generated_booklets row + bump the request status
      const booklet = await createGeneratedBooklet({
        bookletRequestId: input.bookletRequestId,
        sunSign: chart.sun.sign,
        moonSign: chart.moon.sign,
        ascendant: chart.ascendant.sign,
        documentUrl,
        documentFormat: "pdf",
        contentData: { chart, gaps: findGaps(content) } as any,
        status: "ready",
      });
      await updateBookletRequestStatus(input.bookletRequestId, "generated");

      return {
        success: true,
        bookletId: booklet.id,
        documentUrl,
        sunSign: chart.sun.sign,
        moonSign: chart.moon.sign,
        ascendant: chart.ascendant.sign,
        gaps: findGaps(content),
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getGeneratedBookletById(input.id);
    }),

  getForRequest: protectedProcedure
    .input(z.object({ bookletRequestId: z.number() }))
    .query(async ({ input }) => {
      const { getLatestBookletForRequest } = await import("./db");
      return getLatestBookletForRequest(input.bookletRequestId);
    }),

  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      await updateGeneratedBooklet(input.id, { status: input.status as any });
      return { success: true };
    }),
});

// ============================================================================
// HELPER FUNCTIONS FOR ASTRO CALCULATIONS
// ============================================================================

function calculateSunSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
    return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "Aquarius";
  return "Pisces";
}

function calculateMoonSign(date: Date, time: string): string {
  // Simplified calculation - in production, use a proper ephemeris library
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      86400000
  );
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[dayOfYear % 12];
}

function calculateAscendant(
  date: Date,
  time: string,
  place: string
): string {
  // Simplified calculation - in production, use a proper ephemeris library
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  return signs[totalMinutes % 12];
}

// ============================================================================
// MAIN ROUTER
// ============================================================================

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  booklet: bookletRouter,
  appointment: appointmentRouter,
  availability: availabilityRouter,
  blog: blogRouter,
  astro: astroRouter,
  bookletGenerator: bookletGeneratorRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
