const BREVO_API = "https://api.brevo.com/v3/smtp/email";

interface SendEmailParams {
  to: { email: string; name: string }[];
  subject: string;
  htmlContent: string;
  attachments?: { name: string; content: string; contentType?: string }[];
}

export async function sendEmail(params: SendEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME || "HolidayHub";

  if (!apiKey || !fromEmail) {
    console.warn("[email] Brevo not configured — skipping send");
    return { ok: false, notice: "Brevo keys not configured" };
  }

  try {
    const res = await fetch(BREVO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        attachment: params.attachments?.map((a) => ({
          name: a.name,
          content: a.content,
          contentType: a.contentType || "application/pdf",
        })),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Brevo error:", err);
      return { ok: false, error: err };
    }

    return { ok: true };
  } catch (e) {
    console.error("[email] Failed to send:", e);
    return { ok: false, error: String(e) };
  }
}
