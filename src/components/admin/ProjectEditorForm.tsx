"use client";

import { ProjectRecord, ProjectType } from "@/types/project";
import { VideoProjectForm } from "./project-editor/VideoProjectForm";
import { WebProjectForm } from "./project-editor/WebProjectForm";

interface ProjectEditorFormProps {
  mode: "create" | "edit";
  initialProject?: ProjectRecord;
  initialDiscipline?: ProjectType;
}

export function ProjectEditorForm({
  mode,
  initialProject,
  initialDiscipline = "video",
}: ProjectEditorFormProps) {
  const projectType: ProjectType = initialProject?.type ?? initialDiscipline;

  if (projectType === "web") {
    return <WebProjectForm mode={mode} initialProject={initialProject} />;
  }

  return <VideoProjectForm mode={mode} initialProject={initialProject} />;
}
