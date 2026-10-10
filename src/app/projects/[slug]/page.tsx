import { notFound, redirect } from "next/navigation";
import { getProjectBySlugOrId } from "@/lib/projects-service";

interface ProjectRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectSlugPage({ params }: ProjectRedirectProps) {
  const { slug } = await params;
  const project = await getProjectBySlugOrId(slug);

  if (!project) {
    notFound();
  }

  if (project.type === "video") {
    redirect(`/projects/video/${slug}`);
  } else {
    redirect(`/projects/web/${slug}`);
  }
}
