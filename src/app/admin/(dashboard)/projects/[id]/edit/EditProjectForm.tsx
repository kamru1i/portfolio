import { ProjectRecord } from "@/types/project";
import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";

export function EditProjectForm({ project }: { project: ProjectRecord }) {
  return <ProjectEditorForm mode="edit" initialProject={project} />;
}
