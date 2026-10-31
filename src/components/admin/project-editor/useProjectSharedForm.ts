"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AspectRatio, ProjectRecord, ProjectType, VideoProvider } from "@/types/project";

const SLUG_PATTERN = /^[A-Za-z0-9-]+$/;

export function toUrlSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface UseProjectSharedFormOptions {
  mode: "create" | "edit";
  discipline: ProjectType;
  initialProject?: ProjectRecord;
}

export interface SpecificSubmissionFields {
  // Video specific
  video_url?: string;
  video_provider?: VideoProvider;
  video_id?: string | null;
  aspect_ratio?: AspectRatio;
  // Web specific
  live_url?: string;
  github_url?: string | null;
  can_embed?: boolean;
  preview_mode?: "iframe" | "fallback";
  // Shared media preview
  preview_image_url: string | null;
}

export function useProjectSharedForm({
  mode,
  discipline,
  initialProject,
}: UseProjectSharedFormOptions) {
  const router = useRouter();
  const isEdit = mode === "edit" && Boolean(initialProject);

  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [slug, setSlug] = useState(initialProject?.slug ?? "");
  const [clientName, setClientName] = useState(initialProject?.client_name ?? "");
  const [year, setYear] = useState(
    initialProject ? initialProject.year ?? "" : new Date().getFullYear().toString()
  );
  const [description, setDescription] = useState(initialProject?.description ?? "");
  const [role, setRole] = useState(initialProject?.role ?? "");
  const [overview, setOverview] = useState(initialProject?.overview ?? "");
  const [deliverablesInput, setDeliverablesInput] = useState(
    (initialProject?.deliverables ?? []).join(", ")
  );
  const [tagsInput, setTagsInput] = useState((initialProject?.tags ?? []).join(", "));
  const [manualPriority, setManualPriority] = useState<string>(() => {
    if (!initialProject) return "";
    if (initialProject.manual_priority) return initialProject.manual_priority.toString();
    if (initialProject.sort_order && initialProject.sort_order > 0) {
      return initialProject.sort_order.toString();
    }
    return "";
  });
  const [isPublished, setIsPublished] = useState(initialProject?.is_published ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTitleChange = (nextTitle: string) => {
    const prevAutoSlug = toUrlSlug(title);
    setTitle(nextTitle);
    if (!isEdit && (!slug || slug === prevAutoSlug)) {
      setSlug(toUrlSlug(nextTitle));
    }
  };

  const submitProject = async (specificFields: SpecificSubmissionFields) => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (!title.trim()) throw new Error("Project title is required.");
      const trimmedSlug = slug.trim();
      if (trimmedSlug && !SLUG_PATTERN.test(trimmedSlug)) {
        throw new Error(
          "URL slug may only contain letters, numbers, and hyphens (no spaces or slashes)."
        );
      }

      const parsedPriority = manualPriority.trim()
        ? parseInt(manualPriority.trim(), 10)
        : null;
      if (
        parsedPriority !== null &&
        (isNaN(parsedPriority) || parsedPriority <= 0)
      ) {
        throw new Error(
          "Display priority must be a positive integer (e.g. 1, 2, 3...) or left blank."
        );
      }

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const deliverables = deliverablesInput
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        ...(isEdit ? {} : { type: discipline }),
        title: title.trim(),
        slug: trimmedSlug || undefined,
        client_name: clientName.trim() || null,
        year: year.trim() || null,
        description: description.trim(),
        role: role.trim() || null,
        overview: overview.trim() || null,
        deliverables,
        tags,
        manual_priority: parsedPriority,
        is_published: isPublished,
        ...specificFields,
      };

      const endpoint =
        isEdit && initialProject
          ? `/api/admin/projects/${initialProject.id}`
          : "/api/admin/projects";

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(
          resData.error ||
            (isEdit ? "Failed to update project" : "Failed to create project")
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setSubmitting(false);
    }
  };

  return {
    isEdit,
    title,
    slug,
    setSlug,
    clientName,
    setClientName,
    year,
    setYear,
    description,
    setDescription,
    role,
    setRole,
    overview,
    setOverview,
    deliverablesInput,
    setDeliverablesInput,
    tagsInput,
    setTagsInput,
    manualPriority,
    setManualPriority,
    isPublished,
    setIsPublished,
    submitting,
    errorMessage,
    setErrorMessage,
    handleTitleChange,
    submitProject,
  };
}

export type SharedProjectFormController = ReturnType<typeof useProjectSharedForm>;
