"use client";

import { useState } from "react";
import { AspectRatio, ProjectRecord } from "@/types/project";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectFormHeader } from "./ProjectFormHeader";
import { ProjectThumbnailDropzone } from "./ProjectThumbnailDropzone";
import { ProjectSharedDetailsSection } from "./ProjectSharedDetailsSection";
import { useProjectSharedForm } from "./useProjectSharedForm";

interface WebProjectFormProps {
  mode: "create" | "edit";
  initialProject?: ProjectRecord;
}

export function WebProjectForm({ mode, initialProject }: WebProjectFormProps) {
  const shared = useProjectSharedForm({
    mode,
    discipline: "web",
    initialProject,
  });

  const [liveUrl, setLiveUrl] = useState(initialProject?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initialProject?.github_url ?? "");
  const [webPreviewImageUrl, setWebPreviewImageUrl] = useState(
    initialProject && initialProject.type === "web"
      ? initialProject.preview_image_url ?? ""
      : ""
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveUrl.trim()) {
      shared.setErrorMessage("Live URL is required for Web projects.");
      return;
    }

    await shared.submitProject({
      live_url: liveUrl.trim(),
      github_url: githubUrl.trim() || null,
      can_embed: false,
      preview_mode: "fallback",
      preview_image_url: webPreviewImageUrl.trim() || null,
      aspect_ratio: "16:9" as AspectRatio,
    });
  };

  return (
    <div className="w-full space-y-4 select-none">
      <ProjectFormHeader
        discipline="web"
        isEdit={shared.isEdit}
        projectId={initialProject?.id}
      />

      {shared.errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
          {shared.errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono-custom text-xs uppercase tracking-wider text-purple-400">
              Web Application Links &amp; Hero Screenshot
            </h3>
            <span className="font-mono-custom text-[11px] text-[#666]">
              Auto-optimized WebP screenshot preview
            </span>
          </div>

          {/* Single Line: Live Website URL + GitHub Repository URL + Homepage Screenshot (Drop / Paste / Upload) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-end">
            <div className="xl:col-span-4 min-w-0">
              <Label htmlFor="project-live-url" className="mb-1.5">
                Live Website URL *
              </Label>
              <Input
                id="project-live-url"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                required
                placeholder="https://example.com"
                className="h-11 py-2"
              />
            </div>

            <div className="xl:col-span-4 min-w-0">
              <Label htmlFor="project-github-url" className="mb-1.5">
                GitHub Repository URL (Optional)
              </Label>
              <Input
                id="project-github-url"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/kamru1i/project"
                className="h-11 py-2"
              />
            </div>

            <div className="xl:col-span-4 min-w-0">
              <ProjectThumbnailDropzone
                targetType="web"
                label="Homepage Screenshot *"
                imageUrl={webPreviewImageUrl}
                onImageUploaded={(url) => setWebPreviewImageUrl(url)}
                onRemoveImage={() => setWebPreviewImageUrl("")}
                onUploadError={setUploadError}
              />
            </div>
          </div>

          {uploadError && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 text-xs font-mono-custom">
              {uploadError}
            </div>
          )}
        </Card>

        <ProjectSharedDetailsSection
          discipline="web"
          projectId={initialProject?.id}
          shared={shared}
        />
      </form>
    </div>
  );
}
