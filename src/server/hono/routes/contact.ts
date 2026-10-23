import { Hono } from "hono";
import { Resend } from "resend";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 500) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (recent.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recent);
      }
    }
  }

  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function sanitizeSingleLine(text: string, maxLength: number): string {
  return text.replace(/[\r\n\0]+/g, " ").trim().slice(0, maxLength);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const contactRoute = new Hono();

contactRoute.post("/", async (c) => {
  try {
    const forwardedFor = c.req.header("x-forwarded-for");
    const clientIp =
      c.req.header("x-nf-client-connection-ip") ||
      (forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip");

    if (isRateLimited(clientIp)) {
      return c.json(
        { error: "Too many inquiries submitted recently. Please wait a few minutes and try again." },
        429
      );
    }

    const body = await c.req.json();
    const { name, email, company, projectType, budgetRange, timeline, details, botCheck } = body;

    if (botCheck) {
      return c.json({ error: "Spam submission detected." }, 400);
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return c.json({ error: "Name is required." }, 400);
    }
    const cleanName = sanitizeSingleLine(name, 100);

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return c.json({ error: "A valid email address is required." }, 400);
    }
    const cleanEmail = sanitizeSingleLine(email, 120);

    if (!projectType || typeof projectType !== "string") {
      return c.json({ error: "Project type is required." }, 400);
    }
    const cleanProjectType = sanitizeSingleLine(projectType, 100);

    if (!details || typeof details !== "string" || !details.trim()) {
      return c.json({ error: "Project details are required." }, 400);
    }
    const cleanDetails = details.replace(/\0/g, "").trim().slice(0, 5000);
    const cleanCompany =
      company && typeof company === "string" ? sanitizeSingleLine(company, 100) || "N/A" : "N/A";
    const cleanBudget =
      budgetRange && typeof budgetRange === "string"
        ? sanitizeSingleLine(budgetRange, 60) || "Not specified"
        : "Not specified";
    const cleanTimeline =
      timeline && typeof timeline === "string"
        ? sanitizeSingleLine(timeline, 60) || "Not specified"
        : "Not specified";

    const recipient = process.env.CONTACT_TO_EMAIL || "hello@kamrulislam.me";
    const sender = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
    const apiKey = process.env.RESEND_API_KEY;

    const submissionTimeUtc = new Date().toISOString();
    const submissionTimeDhaka = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const textContent = `
========================================
NEW PROJECT ENQUIRY — KAMRUL ISLAM
========================================

CLIENT DETAILS
--------------
Name:    ${cleanName}
Email:   ${cleanEmail}
Company: ${cleanCompany}

PROJECT SPECIFICATIONS
----------------------
Service:  ${cleanProjectType}
Budget:   ${cleanBudget}
Timeline: ${cleanTimeline}

PROJECT BRIEF / DETAILS
-----------------------
${cleanDetails}

SUBMISSION METADATA
-------------------
Timestamp (UTC):   ${submissionTimeUtc}
Timestamp (Dhaka): ${submissionTimeDhaka} (GMT+6)
Recipient:         ${recipient}
========================================
`.trim();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Project Enquiry</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.6);">
    <div style="padding: 28px 32px; border-bottom: 1px solid #222; background: linear-gradient(180deg, #181818 0%, #121212 100%);">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #a1a1a1; font-family: monospace; margin-bottom: 8px;">Portfolio Project Enquiry</div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff;">${escapeHtml(cleanProjectType)}</h1>
      <div style="font-size: 13px; color: #888; margin-top: 4px;">from <strong style="color: #fff;">${escapeHtml(cleanName)}</strong></div>
    </div>
    
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px; font-family: monospace;">Client Email:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;"><a href="mailto:${escapeHtml(cleanEmail)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(cleanEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; font-family: monospace;">Company:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${escapeHtml(cleanCompany)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; font-family: monospace;">Budget Range:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${escapeHtml(cleanBudget)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; font-family: monospace;">Timeline:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${escapeHtml(cleanTimeline)}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #222;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; font-family: monospace; margin-bottom: 12px;">Project Brief &amp; Requirements</div>
        <div style="background-color: #181818; border: 1px solid #2a2a2a; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e5e5e5; white-space: pre-wrap; word-break: break-word;">${escapeHtml(cleanDetails)}</div>
      </div>
    </div>

    <div style="padding: 20px 32px; border-top: 1px solid #222; background-color: #0d0d0d; font-size: 11px; color: #666; font-family: monospace;">
      <div>Received: ${escapeHtml(submissionTimeDhaka)}</div>
      <div style="margin-top: 4px;">Reply directly to this notification to email ${escapeHtml(cleanName)}.</div>
    </div>
  </div>
</body>
</html>
`.trim();

    const autoReplySender =
      process.env.AUTOREPLY_FROM_EMAIL ||
      (sender.includes("onboarding@resend.dev")
        ? "Kamrul Islam (No-Reply) <onboarding@resend.dev>"
        : sender.replace(/<[^>]+>/, "<noreply@kamrulislam.me>"));

    const autoReplyText = `
============================================================
PROJECT ENQUIRY RECEIVED — KAMRUL ISLAM
============================================================

Hello ${cleanName},

Thank you for reaching out. Your project enquiry has been received 
directly by Kamrul Islam.

I personally review all client submissions and will review your 
project requirements within 24–48 business hours.

SUBMISSION SUMMARY
------------------------------------------------------------
Service / Project:  ${cleanProjectType}
Timeline:           ${cleanTimeline}
Budget Range:       ${cleanBudget}
Company:            ${cleanCompany}
Submission Time:    ${submissionTimeDhaka} (GMT+6)

YOUR PROJECT BRIEF
------------------------------------------------------------
${cleanDetails}

============================================================
IMPORTANT — PLEASE DO NOT REPLY DIRECTLY TO THIS EMAIL
============================================================
This notification was sent automatically from a no-reply address 
(noreply@kamrulislam.me). Incoming replies to this address 
are not monitored and will not be received.

If you have additional assets, references, or urgent updates 
to share before I reply, please send them directly to:
hello@kamrulislam.me
============================================================

Best regards,
Kamrul Islam
Lead Video Editor, Web Developer & IT Specialist
https://kamrulislam.me
`.trim();

    const autoReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your Enquiry Has Been Received — Kamrul Islam</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ededed;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.6);">
    <div style="padding: 28px 32px; border-bottom: 1px solid #222; background: linear-gradient(180deg, #181818 0%, #121212 100%);">
      <div style="margin-bottom: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #10b981; font-family: monospace; font-weight: 600;">
        ● ENQUIRY RECEIVED
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">Thank you, ${escapeHtml(cleanName)}.</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #a1a1a1; line-height: 1.5;">Your project enquiry has been delivered directly to Kamrul Islam.</p>
    </div>

    <div style="padding: 24px 32px; background-color: #141414; border-bottom: 1px solid #222;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 32px; vertical-align: top; padding-right: 12px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); text-align: center; line-height: 26px; font-size: 14px; color: #10b981;">✓</div>
          </td>
          <td style="vertical-align: top;">
            <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px;">Under Review — Expected Response Within 24–48 Hours</div>
            <div style="font-size: 13px; color: #999; line-height: 1.5;">I review client briefs daily and will reply directly to <strong style="color: #fff;">${escapeHtml(cleanEmail)}</strong> regarding availability, scoping, and next steps.</div>
          </td>
        </tr>
      </table>
    </div>
    
    <div style="padding: 32px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; font-family: monospace; margin-bottom: 14px;">Summary of Your Submission</div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; width: 140px; font-family: monospace;">Service Requested:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px; font-weight: 500;">${escapeHtml(cleanProjectType)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; font-family: monospace;">Timeline:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${escapeHtml(cleanTimeline)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; font-family: monospace;">Budget Range:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${escapeHtml(cleanBudget)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #888; font-size: 13px; font-family: monospace;">Company:</td>
          <td style="padding: 8px 0; color: #fff; font-size: 14px;">${escapeHtml(cleanCompany)}</td>
        </tr>
      </table>

      <div style="margin-top: 16px; margin-bottom: 24px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; font-family: monospace; margin-bottom: 8px;">Your Project Brief</div>
        <div style="background-color: #181818; border: 1px solid #2a2a2a; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.6; color: #d4d4d4; white-space: pre-wrap; word-break: break-word;">${escapeHtml(cleanDetails)}</div>
      </div>

      <div style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 10px; padding: 14px 16px;">
        <div style="font-size: 12px; font-weight: 600; color: #fbbf24; margin-bottom: 4px; font-family: monospace;">⚠️ AUTOMATED NO-REPLY NOTIFICATION</div>
        <div style="font-size: 12px; color: #d1d5db; line-height: 1.5;">
          This message was generated automatically from an unmonitored address (<strong style="color: #fff;">noreply@kamrulislam.me</strong>). 
          <strong>Please do not reply directly to this email</strong>, as incoming replies cannot be received or monitored.
          <br><br>
          If you need to send additional project attachments or have urgent questions before I respond, please email directly to: 
          <a href="mailto:hello@kamrulislam.me" style="color: #38bdf8; text-decoration: underline;">hello@kamrulislam.me</a>.
        </div>
      </div>
    </div>

    <div style="padding: 20px 32px; border-top: 1px solid #222; background-color: #0d0d0d; font-size: 11px; color: #666; font-family: monospace; line-height: 1.6;">
      <div>Received: ${escapeHtml(submissionTimeDhaka)} (GMT+6)</div>
      <div style="margin-top: 4px; color: #888;">Kamrul Islam · Lead Video Editor, Web Developer &amp; IT Specialist</div>
      <div style="margin-top: 2px;"><a href="https://kamrulislam.me" style="color: #a1a1a1; text-decoration: none;">kamrulislam.me</a></div>
    </div>
  </div>
</body>
</html>
`.trim();

    if (!apiKey) {
      console.warn(
        `[Contact API Notice]: RESEND_API_KEY environment variable is not configured. ` +
          `Enquiry from "${cleanName}" <${cleanEmail}> was received and logged to server console.`
      );

      return c.json(
        {
          error: "Email delivery service is awaiting RESEND_API_KEY configuration.",
          code: "PROVIDER_KEY_MISSING",
        },
        503
      );
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: sender,
      to: [recipient],
      replyTo: cleanEmail,
      subject: `[Portfolio Enquiry] ${cleanProjectType} — ${cleanName}`,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("[Resend Delivery Error]:", error);
      return c.json(
        {
          error: error.message || "Email provider could not initiate delivery.",
          code: "PROVIDER_ERROR",
        },
        502
      );
    }

    let autoReplyDeliveryId: string | null = null;
    let autoReplyErrorMessage: string | null = null;
    try {
      const autoReplyResult = await resend.emails.send({
        from: autoReplySender,
        to: [cleanEmail],
        subject: `[Received] Thank you for your inquiry — Kamrul Islam`,
        text: autoReplyText,
        html: autoReplyHtml,
      });

      if (autoReplyResult.error) {
        autoReplyErrorMessage =
          autoReplyResult.error.message || "Auto-reply awaiting verified domain at resend.com/domains";
      } else {
        autoReplyDeliveryId = autoReplyResult.data?.id || null;
      }
    } catch (autoReplyErr: unknown) {
      autoReplyErrorMessage =
        autoReplyErr instanceof Error
          ? autoReplyErr.message
          : "Auto-reply awaiting verified domain at resend.com/domains";
    }

    return c.json({
      success: true,
      message: "Enquiry delivered successfully.",
      deliveryId: data?.id,
      autoReplyDeliveryId,
      ...(autoReplyErrorMessage ? { autoReplyNotice: autoReplyErrorMessage } : {}),
    });
  } catch (error: unknown) {
    console.error("[Contact API Internal Error]:", error);
    return c.json({ error: "Internal server error processing contact submission." }, 500);
  }
});
