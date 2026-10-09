import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, budgetRange, timeline, details } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!projectType || typeof projectType !== "string") {
      return NextResponse.json(
        { error: "Project type is required." },
        { status: 400 }
      );
    }

    if (!details || typeof details !== "string" || !details.trim()) {
      return NextResponse.json(
        { error: "Project details are required." },
        { status: 400 }
      );
    }

    // Log enquiry submission cleanly
    console.log("[Contact Submission Received]:", {
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      company: company ? String(company).trim() : "N/A",
      projectType,
      budgetRange: budgetRange || "Not specified",
      timeline: timeline || "Not specified",
      detailsLength: details.trim().length,
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry received successfully.",
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { error: "Internal server error processing contact submission." },
      { status: 500 }
    );
  }
}
