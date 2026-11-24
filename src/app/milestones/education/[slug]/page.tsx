import { notFound, redirect } from "next/navigation";
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
  const matched = PORTFOLIO_DATA.milestones.find(
    (m) => m.type === "education" && m.slug === slug
  );
  if (!matched) {
    notFound();
  }
  redirect(`/milestones/education#${encodeURIComponent(matched.slug)}`);
}
