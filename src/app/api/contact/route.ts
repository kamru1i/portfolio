import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, budgetRange, timeline, details, botCheck } = body;

    // Honeypot spam protection
    if (botCheck) {
      return NextResponse.json(
        { error: "Spam submission detected." },
        { status: 400 }
      );
    }

    // Required field validation & sanitization
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }
    const cleanName = name.trim().slice(0, 100);

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }
    const cleanEmail = email.trim().slice(0, 120);

    if (!projectType || typeof projectType !== "string") {
      return NextResponse.json(
        { error: "Project type is required." },
        { status: 400 }
      );
    }
    const cleanProjectType = projectType.trim().slice(0, 100);

    if (!details || typeof details !== "string" || !details.trim()) {
      return NextResponse.json(
        { error: "Project details are required." },
        { status: 400 }
      );
    }
    const cleanDetails = details.trim().slice(0, 5000);
    const cleanCompany = company && typeof company === "string" ? company.trim().slice(0, 100) : "N/A";
    const cleanBudget = budgetRange && typeof budgetRange === "string" ? budgetRange.trim().slice(0, 60) : "Not specified";
    const cleanTimeline = timeline && typeof timeline === "string" ? timeline.trim().slice(0, 60) : "Not specified";

    const recipient = process.env.CONTACT_TO_EMAIL || "inquiry.kamrul@gmail.com";
    const sender = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
    const apiKey = process.env.RESEND_API_KEY;

    const submissionTimeUtc = new Date().toISOString();
    const submissionTimeDhaka = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // Plain text version
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

    // High-fidelity dark editorial HTML template
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

    if (!apiKey) {
      console.warn(
        `[Contact API Notice]: RESEND_API_KEY environment variable is not configured. ` +
        `Enquiry from "${cleanName}" <${cleanEmail}> was received and logged to server console. ` +
        `To activate real email delivery to ${recipient}, please set RESEND_API_KEY in your .env.local file.`
      );

      return NextResponse.json(
        {
          error: "Email delivery service is awaiting RESEND_API_KEY configuration.",
          code: "PROVIDER_KEY_MISSING",
        },
        { status: 503 }
      );
    }

    // Initialize Resend with secure server-side API key
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
      return NextResponse.json(
        {
          error: error.message || "Email provider could not initiate delivery.",
          code: "PROVIDER_ERROR",
        },
        { status: 502 }
      );
    }

    console.log("[Resend Delivery Success]:", {
      id: data?.id,
      to: recipient,
      replyTo: cleanEmail,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry delivered successfully.",
      deliveryId: data?.id,
    });
  } catch (error: any) {
    console.error("[Contact API Internal Error]:", error);
    return NextResponse.json(
      { error: "Internal server error processing contact submission." },
      { status: 500 }
    );
  }
}
