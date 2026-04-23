import { eq, desc, and, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  bookletRequests,
  appointments,
  blogArticles,
  blogCategories,
  blogTags,
  astroSigns,
  astroPlanets,
  astroHouses,
  generatedBooklets,
  stripePayments,
  InsertBookletRequest,
  InsertAppointment,
  InsertBlogArticle,
  InsertAstroSign,
  InsertAstroPlanet,
  InsertAstroHouse,
  InsertGeneratedBooklet,
  InsertStripePayment,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// BOOKLET REQUEST OPERATIONS
// ============================================================================

export async function createBookletRequest(
  data: InsertBookletRequest
): Promise<typeof bookletRequests.$inferSelect> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bookletRequests).values(data);
  const id = result[0].insertId;

  const created = await db
    .select()
    .from(bookletRequests)
    .where(eq(bookletRequests.id, Number(id)))
    .limit(1);

  return created[0];
}

export async function getBookletRequests(
  status?: string,
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query: any = db.select().from(bookletRequests);

  if (status) {
    query = query.where(eq(bookletRequests.status, status as any));
  }

  return query.orderBy(desc(bookletRequests.createdAt)).limit(limit).offset(offset);
}

export async function getBookletRequestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(bookletRequests)
    .where(eq(bookletRequests.id, id))
    .limit(1);

  return result[0];
}

export async function updateBookletRequestStatus(
  id: number,
  status: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(bookletRequests)
    .set({ status: status as any })
    .where(eq(bookletRequests.id, id));
}

// ============================================================================
// APPOINTMENT OPERATIONS
// ============================================================================

export async function createAppointment(
  data: InsertAppointment
): Promise<typeof appointments.$inferSelect> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(appointments).values(data);
  const id = result[0].insertId;

  const created = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, Number(id)))
    .limit(1);

  return created[0];
}

export async function getAppointments(
  status?: string,
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  let query: any = db.select().from(appointments);

  if (status) {
    query = query.where(eq(appointments.status, status as any));
  }

  return query
    .orderBy(desc(appointments.appointmentDate))
    .limit(limit)
    .offset(offset);
}

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);

  return result[0];
}

export async function updateAppointmentStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(appointments)
    .set({ status: status as any })
    .where(eq(appointments.id, id));
}

// ============================================================================
// BLOG OPERATIONS
// ============================================================================

export async function createBlogArticle(
  data: InsertBlogArticle
): Promise<typeof blogArticles.$inferSelect> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogArticles).values(data);
  const id = result[0].insertId;

  const created = await db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.id, Number(id)))
    .limit(1);

  return created[0];
}

export async function getBlogArticles(
  status: string = "published",
  limit: number = 10,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.status, status as any))
    .orderBy(desc(blogArticles.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getBlogArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(blogArticles)
    .where(
      and(
        eq(blogArticles.slug, slug),
        eq(blogArticles.status, "published")
      )
    )
    .limit(1);

  return result[0];
}

export async function searchBlogArticles(
  query: string,
  limit: number = 10
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(blogArticles)
    .where(
      and(
        eq(blogArticles.status, "published"),
        like(blogArticles.title, `%${query}%`)
      )
    )
    .limit(limit);
}

export async function getAllBlogArticles(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(blogArticles)
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getBlogArticleById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.id, id))
    .limit(1);
  return result[0];
}

export async function updateBlogArticle(
  id: number,
  data: Partial<InsertBlogArticle>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogArticles).set(data).where(eq(blogArticles.id, id));
  const result = await db
    .select()
    .from(blogArticles)
    .where(eq(blogArticles.id, id))
    .limit(1);
  return result[0];
}

export async function deleteBlogArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogArticles).where(eq(blogArticles.id, id));
}

// ============================================================================
// ASTRO CONTENT OPERATIONS
// ============================================================================

export async function getAstroSigns() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(astroSigns).orderBy(astroSigns.id);
}

export async function getAstroSignByName(name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(astroSigns)
    .where(eq(astroSigns.name, name))
    .limit(1);

  return result[0];
}

export async function getAstroPlanets() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(astroPlanets).orderBy(astroPlanets.id);
}

export async function getAstroPlanetByName(name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(astroPlanets)
    .where(eq(astroPlanets.name, name))
    .limit(1);

  return result[0];
}

export async function getAstroHouses() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(astroHouses).orderBy(astroHouses.houseNumber);
}

export async function getAstroHouseByNumber(houseNumber: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(astroHouses)
    .where(eq(astroHouses.houseNumber, houseNumber))
    .limit(1);

  return result[0];
}

// ============================================================================
// GENERATED BOOKLET OPERATIONS
// ============================================================================

export async function createGeneratedBooklet(
  data: InsertGeneratedBooklet
): Promise<typeof generatedBooklets.$inferSelect> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(generatedBooklets).values(data);
  const id = result[0].insertId;

  const created = await db
    .select()
    .from(generatedBooklets)
    .where(eq(generatedBooklets.id, Number(id)))
    .limit(1);

  return created[0];
}

export async function getGeneratedBookletById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(generatedBooklets)
    .where(eq(generatedBooklets.id, id))
    .limit(1);

  return result[0];
}

export async function getLatestBookletForRequest(bookletRequestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .select()
    .from(generatedBooklets)
    .where(eq(generatedBooklets.bookletRequestId, bookletRequestId))
    .orderBy(desc(generatedBooklets.createdAt))
    .limit(1);
  return result[0];
}

export async function updateGeneratedBooklet(
  id: number,
  data: Partial<typeof generatedBooklets.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(generatedBooklets).set(data).where(eq(generatedBooklets.id, id));
}

// ============================================================================
// STRIPE PAYMENT OPERATIONS
// ============================================================================

export async function createStripePayment(
  data: InsertStripePayment
): Promise<typeof stripePayments.$inferSelect> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(stripePayments).values(data);
  const id = result[0].insertId;

  const created = await db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.id, Number(id)))
    .limit(1);

  return created[0];
}

export async function getStripePaymentByIntentId(
  stripePaymentIntentId: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);

  return result[0];
}

export async function getStripePaymentBySessionId(stripeSessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.stripeSessionId, stripeSessionId))
    .limit(1);

  return result[0];
}

export async function updateStripePaymentStatus(
  id: number,
  status: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(stripePayments)
    .set({ status: status as any })
    .where(eq(stripePayments.id, id));
}

export async function updateStripePaymentBySessionId(
  stripeSessionId: string,
  data: Partial<Pick<typeof stripePayments.$inferInsert, "status" | "stripePaymentIntentId">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(stripePayments)
    .set(data as any)
    .where(eq(stripePayments.stripeSessionId, stripeSessionId));
}

export async function getStripePaymentsByBookletRequest(
  bookletRequestId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.bookletRequestId, bookletRequestId));
}

export async function getStripePaymentsByAppointment(appointmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(stripePayments)
    .where(eq(stripePayments.appointmentId, appointmentId));
}
