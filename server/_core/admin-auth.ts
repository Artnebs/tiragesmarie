import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { User } from "../../drizzle/schema";

/**
 * Minimal single-admin auth. Marie logs in with an env-provided password;
 * the server issues an HS256 JWT cookie; protected tRPC procedures see a
 * synthetic admin User in ctx.user.
 *
 * This replaces the removed Manus OAuth SDK. For a one-admin site it is
 * strictly simpler and carries no third-party dependency.
 */

const SESSION_TTL_MS = ONE_YEAR_MS;
const ADMIN_USER_ID = 1;
const ADMIN_OPEN_ID = "admin-marie";

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.JWT_SECRET);
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? "";
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function signAdminToken(): Promise<string> {
  const secret = getSecret();
  const expSeconds = Math.floor((Date.now() + SESSION_TTL_MS) / 1000);
  return new SignJWT({ role: "admin", name: "Marie" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(ADMIN_OPEN_ID)
    .setExpirationTime(expSeconds)
    .sign(secret);
}

export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !input) return false;
  return safeEq(input, expected);
}

export async function verifyAdminCookie(
  cookieValue: string | undefined | null,
): Promise<User | null> {
  if (!cookieValue) return null;
  try {
    const { payload } = await jwtVerify(cookieValue, getSecret(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin" || typeof payload.sub !== "string") {
      return null;
    }
    // Synthetic admin user. We never hit the users table for this single-admin flow.
    const now = new Date();
    return {
      id: ADMIN_USER_ID,
      openId: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "Marie",
      email: process.env.OWNER_EMAIL ?? null,
      loginMethod: "password",
      role: "admin",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    };
  } catch {
    return null;
  }
}

export function readSessionCookie(req: Request): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  const parsed = parseCookieHeader(header);
  return parsed[COOKIE_NAME];
}
