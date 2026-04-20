import type { CookieOptions, Request } from "express";

function isSecureRequest(req: Request): boolean {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");
  return protoList.some((p) => p.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request,
): Pick<CookieOptions, "httpOnly" | "path" | "sameSite" | "secure"> {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    // "lax" covers same-origin nav and form posts; it works over both http and https.
    // Over https we still mark the cookie Secure so the browser restricts transport.
    sameSite: "lax",
    secure,
  };
}
