import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  datetime,
  json,
  longtext,
  time,
  date,
  primaryKey,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Stripe Payments - Paiements (Livrets et Rendez-vous)
 * Stocke les références Stripe et les métadonnées commerciales
 */
export const stripePayments = mysqlTable("stripe_payments", {
  id: int("id").autoincrement().primaryKey(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 100 }).notNull().unique(),
  stripeSessionId: varchar("stripeSessionId", { length: 100 }),
  bookletRequestId: int("bookletRequestId"),
  appointmentId: int("appointmentId"),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("eur").notNull(),
  productType: mysqlEnum("productType", ["booklet", "appointment"]).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "succeeded",
    "failed",
    "cancelled",
    "refunded",
  ])
    .default("pending")
    .notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StripePayment = typeof stripePayments.$inferSelect;
export type InsertStripePayment = typeof stripePayments.$inferInsert;

/**
 * Booklet Requests - Demandes de livrets astrologiques
 */
export const bookletRequests = mysqlTable("booklet_requests", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  dateOfBirth: date("dateOfBirth").notNull(),
  timeOfBirth: time("timeOfBirth").notNull(),
  placeOfBirth: varchar("placeOfBirth", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "generated", "sent", "completed"])
    .default("pending")
    .notNull(),
  generatedBookletId: int("generatedBookletId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookletRequest = typeof bookletRequests.$inferSelect;
export type InsertBookletRequest = typeof bookletRequests.$inferInsert;

/**
 * Generated Booklets - Livrets générés
 */
export const generatedBooklets = mysqlTable("generated_booklets", {
  id: int("id").autoincrement().primaryKey(),
  bookletRequestId: int("bookletRequestId").notNull(),
  sunSign: varchar("sunSign", { length: 50 }),
  moonSign: varchar("moonSign", { length: 50 }),
  ascendant: varchar("ascendant", { length: 50 }),
  documentUrl: varchar("documentUrl", { length: 500 }),
  documentFormat: mysqlEnum("documentFormat", ["pdf", "pptx"])
    .default("pdf")
    .notNull(),
  contentData: json("contentData"),
  status: mysqlEnum("status", ["draft", "ready", "sent", "downloaded"])
    .default("draft")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GeneratedBooklet = typeof generatedBooklets.$inferSelect;
export type InsertGeneratedBooklet = typeof generatedBooklets.$inferInsert;

/**
 * Appointments - Rendez-vous
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  appointmentDate: datetime("appointmentDate").notNull(),
  message: text("message"),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Blog Categories - Catégories de blog
 */
export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

/**
 * Blog Tags - Tags de blog
 */
export const blogTags = mysqlTable("blog_tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlogTag = typeof blogTags.$inferSelect;
export type InsertBlogTag = typeof blogTags.$inferInsert;

/**
 * Blog Articles - Articles de blog
 */
export const blogArticles = mysqlTable("blog_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: longtext("content").notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  metaDescription: varchar("metaDescription", { length: 160 }),
  keywords: varchar("keywords", { length: 255 }),
  ogImage: varchar("ogImage", { length: 500 }),
  categoryId: int("categoryId"),
  authorId: int("authorId"),
  status: mysqlEnum("status", ["draft", "published"])
    .default("draft")
    .notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = typeof blogArticles.$inferInsert;

/**
 * Article-Tag Junction Table
 */
export const articleTags = mysqlTable(
  "article_tags",
  {
    articleId: int("articleId").notNull(),
    tagId: int("tagId").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.tagId] }),
  })
);

/**
 * Astro Signs - Signes astrologiques (12)
 */
export const astroSigns = mysqlTable("astro_signs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  symbol: varchar("symbol", { length: 10 }),
  element: varchar("element", { length: 20 }),
  description: longtext("description"),
  strengths: longtext("strengths"),
  challenges: longtext("challenges"),
  advice: longtext("advice"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AstroSign = typeof astroSigns.$inferSelect;
export type InsertAstroSign = typeof astroSigns.$inferInsert;

/**
 * Astro Planets - Planètes (10)
 */
export const astroPlanets = mysqlTable("astro_planets", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  symbol: varchar("symbol", { length: 10 }),
  meaning: longtext("meaning"),
  influence: longtext("influence"),
  interpretation: longtext("interpretation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AstroPlanet = typeof astroPlanets.$inferSelect;
export type InsertAstroPlanet = typeof astroPlanets.$inferInsert;

/**
 * Astro Houses - Maisons astrologiques (12)
 */
export const astroHouses = mysqlTable("astro_houses", {
  id: int("id").autoincrement().primaryKey(),
  houseNumber: int("houseNumber").notNull().unique(),
  meaning: longtext("meaning"),
  influence: longtext("influence"),
  interpretation: longtext("interpretation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AstroHouse = typeof astroHouses.$inferSelect;
export type InsertAstroHouse = typeof astroHouses.$inferInsert;

/**
 * Booklet Templates - Templates de livrets
 */
export const bookletTemplates = mysqlTable("booklet_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  section: varchar("section", { length: 50 }).notNull(),
  content: longtext("content"),
  order: int("order"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookletTemplate = typeof bookletTemplates.$inferSelect;
export type InsertBookletTemplate = typeof bookletTemplates.$inferInsert;

/**
 * Availability Rules - Règles de disponibilité hebdomadaires de Marie
 */
export const availabilityRules = mysqlTable("availability_rules", {
  id: int("id").autoincrement().primaryKey(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Sunday … 6=Saturday
  startTime: varchar("startTime", { length: 5 }).notNull(), // "HH:MM"
  endTime: varchar("endTime", { length: 5 }).notNull(), // "HH:MM"
  slotDurationMin: int("slotDurationMin").notNull().default(90),
  isActive: int("isActive", { unsigned: true }).notNull().default(1), // boolean as tinyint
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AvailabilityRule = typeof availabilityRules.$inferSelect;
export type InsertAvailabilityRule = typeof availabilityRules.$inferInsert;

/**
 * Availability Blocks - Fenêtres bloquées ponctuelles (vacances, exceptions)
 */
export const availabilityBlocks = mysqlTable("availability_blocks", {
  id: int("id").autoincrement().primaryKey(),
  startAt: datetime("startAt").notNull(),
  endAt: datetime("endAt").notNull(),
  reason: varchar("reason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AvailabilityBlock = typeof availabilityBlocks.$inferSelect;
export type InsertAvailabilityBlock = typeof availabilityBlocks.$inferInsert;
