import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects-service";
import { EditProjectForm } from "./EditProjectForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}
