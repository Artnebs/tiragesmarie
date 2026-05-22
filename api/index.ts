/**
 * Vercel Serverless Function — catches all /api/* requests.
 *
 * Vercel rewrites `api/index.ts` as the function handler for this project.
 * The vercel.json routes block sends every /api/* request here and lets
 * everything else fall through to the static client build in dist/public/.
 *
 * Note: `dotenv/config` is NOT imported here. On Vercel, secrets come from
 * the Vercel environment (project settings → Environment Variables), not
 * from a .env file. Importing dotenv would be a no-op and adds noise.
 */

import { createApp } from "../server/_core/app";

// Singleton: reuse the same express app across warm invocations.
const app = createApp();

export default app;
