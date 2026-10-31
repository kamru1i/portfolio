"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ProjectType } from "@/types/project";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SharedProjectFormController } from "./useProjectSharedForm";

interface ProjectSharedDetailsSectionProps {
  discipline: ProjectType;
  projectId?: string;
  shared: SharedProjectFormController;
}

export function ProjectSharedDetailsSection({
  discipline,
  projectId,
  shared,
}: ProjectSharedDetailsSectionProps) {
  const isVideo = discipline === "video";
  const {
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
    handleTitleChange,
  } = shared;

  return (
    <>
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono-custom text-xs uppercase tracking-wider text-white/70">
            Project Information &amp; Case Study Details
          </h3>
          <span className="font-mono-custom text-[11px] text-[#666]">
            /projects/{discipline}/{slug || projectId || "[slug]"}
          </span>
        </div>

        {/* Line 1: Project Title + URL Slug + Client / Brand Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="project-title" className="mb-1.5">
              Project Title *
            </Label>
            <Input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="e.g. Syston Autos Cinema"
              className="h-10 py-2"
            />
          </div>

          <div>
            <Label htmlFor="project-slug" className="mb-1.5">
              URL Slug *
            </Label>
            <Input
              id="project-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="syston-autos-cinema"
              className="h-10 py-2 font-mono-custom"
            />
          </div>

          <div>
            <Label htmlFor="project-client" className="mb-1.5">
              Client / Brand Name
            </Label>
            <Input
              id="project-client"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Independent Client Project"
              className="h-10 py-2"
            />
          </div>
        </div>

        {/* Line 2: Year + Your Role + Deliverables + Priority Rank + Publishing Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="project-year" className="mb-1.5">
              Year
            </Label>
            <Input
              id="project-year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2026"
              className="h-10 py-2 font-mono-custom"
            />
          </div>

          <div className="lg:col-span-3">
            <Label htmlFor="project-role" className="mb-1.5">
              Your Role
            </Label>
            <Input
              id="project-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={
                isVideo
                  ? "e.g. Video Editor & AI Creator"
                  : "e.g. Web Developer & UI Engineer"
              }
              className="h-10 py-2"
            />
          </div>

          <div className="lg:col-span-3">
            <Label htmlFor="project-deliverables" className="mb-1.5">
              Deliverables (comma separated)
            </Label>
            <Input
              id="project-deliverables"
              type="text"
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              placeholder={
                isVideo
                  ? "e.g. Master Cut, Color, Audio"
                  : "e.g. Web App, Admin CMS, API"
              }
              className="h-10 py-2 font-mono-custom"
            />
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="project-priority">Priority Rank</Label>
              <span className="font-mono-custom text-[10px] text-amber-400">
                {manualPriority ? `#${manualPriority}` : "Auto"}
              </span>
            </div>
            <Input
              id="project-priority"
              type="number"
              min="1"
              step="1"
              value={manualPriority}
              onChange={(e) => setManualPriority(e.target.value)}
              placeholder="e.g. 1, 2..."
              className="h-10 py-2 font-mono-custom"
            />
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <Label>Status</Label>
              <span className="font-mono-custom text-[10px] text-[#777]">
                {isPublished ? "Public" : "Hidden"}
              </span>
            </div>
            <Button
              type="button"
              variant={isPublished ? "success" : "warning"}
              onClick={() => setIsPublished(!isPublished)}
              className="w-full h-10 uppercase tracking-wider text-xs justify-center"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPublished ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>{isPublished ? "Published" : "Draft"}</span>
            </Button>
          </div>
        </div>

        {/* Line 3: Tags / Technologies + Short Summary / Description on the Same Line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <Label htmlFor="project-tags" className="mb-1.5">
              Tags / Technologies (comma separated)
            </Label>
            <Input
              id="project-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={
                isVideo
                  ? "e.g. Premiere Pro, DaVinci Resolve, Sound Design"
                  : "e.g. Next.js, TypeScript, Tailwind CSS, Supabase"
              }
              className="h-10 py-2 font-mono-custom"
            />
          </div>

          <div>
            <Label htmlFor="project-description" className="mb-1.5">
              Short Summary / Description
            </Label>
            <Input
              id="project-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise summary displayed on project cards and top of case study..."
              className="h-10 py-2"
            />
          </div>
        </div>

        {/* Line 4: Detailed Case Study Overview right below */}
        <div>
          <Label htmlFor="project-overview" className="mb-1.5">
            Detailed Case Study Overview
          </Label>
          <Textarea
            id="project-overview"
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="In-depth breakdown of the architecture, editing workflow, challenges solved, and final delivery..."
          />
        </div>
      </Card>

      {/* Clean Bottom Submit Bar — Only Cancel & Save/Publish Project */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <Link
          href="/admin"
          className={buttonVariants({
            variant: "secondary",
            size: "default",
            className: "px-5 py-2.5 h-10 text-xs",
          })}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 h-10 text-xs"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              <span>{isEdit ? "Saving Changes..." : "Publishing Project..."}</span>
            </>
          ) : (
            <span>{isEdit ? "Save Changes" : "Save & Publish Project"}</span>
          )}
        </Button>
      </div>
    </>
  );
}
