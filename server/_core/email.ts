import type { ReactElement } from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";

// ---------------------------------------------------------------------------
// Lazy singleton — only instantiated when RESEND_API_KEY is present.
// ---------------------------------------------------------------------------
let _resend: Resend | null | undefined = undefined; // undefined = not yet initialised

export function getResend(): Resend | null {
  if (_resend !== undefined) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key || key.trim() === "") {
    console.warn("[email] RESEND_API_KEY is not set — email delivery disabled");
    _resend = null;
  } else {
    _resend = new Resend(key);
  }
  return _resend;
}

// ---------------------------------------------------------------------------
// Structured send result — never throws.
// ---------------------------------------------------------------------------
export interface SendResult {
  delivered: boolean;
  id?: string;
  error?: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  react: ReactElement;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendResult> {
  const from = process.env.FROM_EMAIL;
  if (!from || from.trim() === "") {
    console.error("[email] FROM_EMAIL is not set — cannot send email");
    return { delivered: false, error: "FROM_EMAIL not configured" };
  }

  const resend = getResend();
  if (!resend) {
    console.warn(
      `[email] Resend unavailable — would have sent "${params.subject}" to ${params.to}`
    );
    return { delivered: false, error: "Resend not configured" };
  }

  let html: string;
  let text: string;
  try {
    html = await render(params.react);
    text = await render(params.react, { plainText: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Failed to render template:", message);
    return { delivered: false, error: `Template render error: ${message}` };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html,
      text,
      ...(params.replyTo ? { replyTo: params.replyTo } : {}),
    });

    if (error) {
      console.error("[email] Resend API error:", error.message);
      return { delivered: false, error: error.message };
    }

    console.log(`[email] Delivered "${params.subject}" to ${params.to} (id: ${data?.id})`);
    return { delivered: true, id: data?.id ?? undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] Unexpected error sending email:", message);
    return { delivered: false, error: message };
  }
}
