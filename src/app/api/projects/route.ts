import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/projects-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await getPublishedProjects();
    return NextResponse.json({ projects }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}
