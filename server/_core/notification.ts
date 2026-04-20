export type NotificationPayload = {
  title: string;
  content: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Stub replacing the former Manus Forge notification call.
 * Logs to stdout so local dev gets visibility; a real implementation
 * (Resend email, Slack webhook, etc.) will land in Phase 2.
 * Always returns false so callers treat it as best-effort.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  if (!isNonEmptyString(payload.title) || !isNonEmptyString(payload.content)) {
    console.warn("[Notification] invalid payload, skipping", payload);
    return false;
  }
  console.log(`[Notification][stub] ${payload.title} — ${payload.content}`);
  return false;
}
