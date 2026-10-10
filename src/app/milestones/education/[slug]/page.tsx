import { redirect } from "next/navigation";
import { PORTFOLIO_DATA } from "@/lib/portfolio-data";

interface EducationSlugProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PORTFOLIO_DATA.milestones
    .filter((m) => m.type === "education")
    .map((m) => ({
      slug: m.slug,
    }));
}

export default async function EducationQualificationRedirect({
  params,
}: EducationSlugProps) {
  const { slug } = await params;
  // Gracefully redirect any individual qualification subroute to its designated
  // anchor section on the consolidated Education qualifications page
  redirect(`/milestones/education#${slug}`);
}
