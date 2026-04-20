import type { Express, Request, Response } from "express";
import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import {
  isAdminAuthConfigured,
  signAdminToken,
  verifyAdminPassword,
} from "./admin-auth";

const LoginSchema = z.object({
  password: z.string().min(1, "password required"),
});

/**
 * Local password-based admin login. Replaces the removed Manus OAuth flow.
 * POST /api/auth/login — body { password }; sets the session cookie on success.
 */
export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    if (!isAdminAuthConfigured()) {
      res.status(503).json({
        error:
          "Admin auth is not configured. Set ADMIN_PASSWORD and JWT_SECRET in the server env.",
      });
      return;
    }

    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    if (!verifyAdminPassword(parsed.data.password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = await signAdminToken();
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });
    res.json({ success: true });
  });
}
