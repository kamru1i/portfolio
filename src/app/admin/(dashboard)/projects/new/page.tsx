import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";
import type { ProjectType } from "@/types/project";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const resolved = await searchParams;
  const initialDiscipline: ProjectType =
    resolved?.type === "web" ? "web" : "video";

  return (
    <ProjectEditorForm
      key={initialDiscipline}
      mode="create"
      initialDiscipline={initialDiscipline}
    />
  );
}
