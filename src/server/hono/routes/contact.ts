import { Hono } from "hono";
import { Resend } from "resend";
import { z } from "zod";
import { saveContactInquiry } from "@/lib/inquiries-service";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { renderContactEmails } from "@/emails/render-contact-emails";

const contactPayloadSchema = z.object({
  name: z.string({ error: "Name is required." }).trim().min(1, "Name is required.").max(100),
  email: z
    .string({ error: "A valid email address is required." })
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "A valid email address is required.")
    .max(120),
  company: z.string().max(100).optional().nullable(),
  projectType: z
    .string({ error: "Project type is required." })
    .trim()
    .min(1, "Project type is required.")
    .max(100),
  budgetRange: z.string().max(60).optional().nullable(),
  timeline: z.string().max(60).optional().nullable(),
  details: z
    .string({ error: "Project details are required." })
    .trim()
    .min(1, "Project details are required.")
    .max(5000),
  botCheck: z.string().optional().nullable(),
});

function sanitizeSingleLine(text: string, maxLength: number): string {
  return text.replace(/[\r\n\0]+/g, " ").trim().slice(0, maxLength);
}

export const contactRoute = new Hono();

contactRoute.post("/", async (c) => {
  try {
    const forwardedFor = c.req.header("x-forwarded-for");
    const clientIp =
      c.req.header("x-nf-client-connection-ip") ||
      (forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown-ip");

    if (await checkContactRateLimit(clientIp)) {
      return c.json(
        { error: "Too many inquiries submitted recently. Please wait a few minutes and try again." },
        429
      );
    }

    const contentLength = Number(c.req.header("content-length") || 0);
    if (contentLength > 32 * 1024) {
      return c.json({ error: "Request payload is too large." }, 413);
    }

    const rawBody = await c.req.text();
    if (rawBody.length > 32 * 1024) {
      return c.json({ error: "Request payload is too large." }, 413);
    }

    let rawParsed: unknown;
    try {
      rawParsed = JSON.parse(rawBody);
    } catch {
      return c.json({ error: "Invalid JSON payload." }, 400);
    }

    if (!rawParsed || typeof rawParsed !== "object") {
      return c.json({ error: "Invalid request payload." }, 400);
    }

    const rawRecord = rawParsed as Record<string, unknown>;
    if (rawRecord.botCheck) {
      return c.json({ error: "Spam submission detected." }, 400);
    }

    const parsedResult = contactPayloadSchema.safeParse(rawParsed);
    if (!parsedResult.success) {
      return c.json(
        { error: parsedResult.error.issues[0]?.message || "Invalid submission fields." },
        400
      );
    }

    const { name, email, company, projectType, budgetRange, timeline, details } =
      parsedResult.data;

    const cleanName = sanitizeSingleLine(name, 100);
    const cleanEmail = sanitizeSingleLine(email, 120);
    const cleanProjectType = sanitizeSingleLine(projectType, 100);
    const cleanDetails = details.replace(/\0/g, "").trim().slice(0, 5000);
    const cleanCompany = company ? sanitizeSingleLine(company, 100) || "N/A" : "N/A";
    const cleanBudget = budgetRange
      ? sanitizeSingleLine(budgetRange, 60) || "Not specified"
      : "Not specified";
    const cleanTimeline = timeline
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
Video Editor, AI-Assisted Content Creator, Web Developer & IT Professional
https://kamrulislam.me
`.trim();

    let providerAccepted = false;

    if (!apiKey) {
      console.warn(
        "[Contact API Notice]: RESEND_API_KEY is not configured; persisting enquiry to Admin Inquiries Inbox."
      );
    } else {
      try {
        const { notificationHtml, autoReplyHtml } = await renderContactEmails({
          cleanName,
          cleanEmail,
          cleanCompany,
          cleanProjectType,
          cleanBudget,
          cleanTimeline,
          cleanDetails,
          submissionTimeDhaka,
        });

        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from: sender,
          to: [recipient],
          replyTo: cleanEmail,
          subject: `[Portfolio Enquiry] ${cleanProjectType} — ${cleanName}`,
          text: textContent,
          html: notificationHtml,
        });

        if (error) {
          console.error("[Resend Provider Error]: Failed to dispatch primary notification.");
        } else {
          providerAccepted = true;

          try {
            await resend.emails.send({
              from: autoReplySender,
              to: [cleanEmail],
              subject: `[Received] Thank you for your inquiry — Kamrul Islam`,
              text: autoReplyText,
              html: autoReplyHtml,
            });
          } catch {
            // Non-fatal courtesy receipt failure; do not expose provider internals
          }
        }
      } catch {
        console.error("[Resend Exception]: Failed to communicate with email provider.");
      }
    }

    // Always persist inquiry to Admin Inquiries Inbox (Supabase + runtime fallback)
    const backupResult = await saveContactInquiry({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany === "N/A" ? null : cleanCompany,
      project_type: cleanProjectType,
      budget_range: cleanBudget === "Not specified" ? null : cleanBudget,
      timeline: cleanTimeline === "Not specified" ? null : cleanTimeline,
      details: cleanDetails,
      email_delivered: providerAccepted,
    });

    if (!providerAccepted && !backupResult.saved) {
      return c.json(
        {
          error: "Unable to record your inquiry right now. Please use the direct email option.",
          code: "DELIVERY_FAILED",
        },
        502
      );
    }

    return c.json({
      success: true,
      message: "Enquiry received.",
      savedToInbox: backupResult.saved,
      providerAccepted,
    });
  } catch {
    console.error("[Contact API Internal Error]: Unexpected failure processing submission.");
    return c.json({ error: "Internal server error processing contact submission." }, 500);
  }
});
