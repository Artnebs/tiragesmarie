import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Legacy shape — kept for backward-compatibility.
// New code should call sendEmail() from email.ts directly.
// ---------------------------------------------------------------------------
export type NotificationPayload = {
  title: string;
  content: string;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Safety-net notification channel.
 * Sends a plain-text email to OWNER_EMAIL via Resend when the API key is
 * available; otherwise falls back to a console log so local dev still works.
 *
 * Accepts both the legacy { title, content } shape and an extended
 * { subject, text, html? } shape.
 */
export async function notifyOwner(
  payload: NotificationPayload | { subject: string; text: string; html?: string }
): Promise<boolean> {
  // Normalise to { subject, text, html? }
  let subject: string;
  let text: string;
  let html: string | undefined;

  if ("title" in payload) {
    if (!isNonEmptyString(payload.title) || !isNonEmptyString(payload.content)) {
      console.warn("[Notification] payload invalide, ignoré", payload);
      return false;
    }
    subject = payload.title;
    text = payload.content;
  } else {
    if (!isNonEmptyString(payload.subject) || !isNonEmptyString(payload.text)) {
      console.warn("[Notification] payload invalide, ignoré", payload);
      return false;
    }
    subject = payload.subject;
    text = payload.text;
    html = payload.html;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!apiKey || !from || !ownerEmail) {
    console.log(
      `[Notification][stub] ${subject} — ${text.slice(0, 120)}${text.length > 120 ? "…" : ""}`
    );
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: ownerEmail,
      subject,
      text,
      ...(html ? { html } : {}),
    });

    if (error) {
      console.error("[Notification] Erreur Resend:", error.message);
      return false;
    }

    console.log(`[Notification] Envoyé "${subject}" à ${ownerEmail}`);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Notification] Erreur inattendue:", message);
    return false;
  }
}
