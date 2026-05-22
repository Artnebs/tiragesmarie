/**
 * migrate-workshop.ts
 *
 * One-shot migration runner for the workshop deployment.
 * Run this ONCE after provisioning the TiDB Cloud (or any MySQL-compatible) DB.
 *
 * Usage:
 *   DATABASE_URL="mysql://user:pass@host:4000/tirages_marie?ssl={'rejectUnauthorized':true}" \
 *     pnpm tsx scripts/migrate-workshop.ts
 *
 * What it does:
 *   1. Connects to the target DB via DATABASE_URL.
 *   2. Runs all pending Drizzle migrations in drizzle/ (in order).
 *   3. Exits 0 on success, 1 on failure.
 *
 * Safe to run multiple times — Drizzle tracks applied migrations in __drizzle_migrations.
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("[migrate] ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

console.log("[migrate] Connecting to database…");

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

const migrationsFolder = path.resolve(__dirname, "../drizzle");

console.log(`[migrate] Running migrations from ${migrationsFolder}…`);

try {
  await migrate(db, { migrationsFolder });
  console.log("[migrate] All migrations applied successfully.");
} catch (err) {
  console.error("[migrate] Migration failed:", err);
  await connection.end();
  process.exit(1);
}

await connection.end();
console.log("[migrate] Done.");
