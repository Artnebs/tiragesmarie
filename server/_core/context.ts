import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { readSessionCookie, verifyAdminCookie } from "./admin-auth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<TrpcContext> {
  const cookie = readSessionCookie(opts.req);
  const user = await verifyAdminCookie(cookie);

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
