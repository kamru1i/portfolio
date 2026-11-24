import { describe, expect, it } from "vitest";
import { renderContactEmails } from "./render-contact-emails";

describe("renderContactEmails", () => {
  it("renders notification and auto-reply HTML and escapes injected markup", async () => {
    const xssName = '<script>alert("xss")</script> Alex';
    const xssDetails = 'Need edits on <img src=x onerror="alert(1)"> intro.';

    const { notificationHtml, autoReplyHtml } = await renderContactEmails({
      cleanName: xssName,
      cleanEmail: "alex@example.com",
      cleanCompany: "Studio X",
      cleanProjectType: "Video Editing & Post-Production",
      cleanBudget: "$1,000 – $3,000",
      cleanTimeline: "1 to 2 weeks",
      cleanDetails: xssDetails,
      submissionTimeDhaka: "November 24, 2026 at 9:45:00 PM GMT+6",
    });

    expect(notificationHtml).toContain("Portfolio Project Enquiry");
    expect(notificationHtml).toContain("alex@example.com");
    expect(notificationHtml).toContain("Studio X");
    expect(notificationHtml).not.toContain("<script>alert");
    expect(notificationHtml).not.toContain('<img src=x onerror="alert(1)">');

    expect(autoReplyHtml).toContain("ENQUIRY RECEIVED");
    expect(autoReplyHtml).toContain("noreply@kamrulislam.me");
    expect(autoReplyHtml).toContain("hello@kamrulislam.me");
    expect(autoReplyHtml).not.toContain("<script>alert");
  });
});
