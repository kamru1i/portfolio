"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProjectType } from "@/types/project";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getSavedAdminReturnUrl,
  markAdminReturnScrollRestore,
  SharedProjectFormController,
} from "./useProjectSharedForm";

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
  const router = useRouter();
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
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h3 className="font-mono-custom text-xs uppercase tracking-wider text-white/70">
            Project Information &amp; Case Study Details
          </h3>
          <span className="font-mono-custom text-[11px] text-[#666] truncate max-w-full">
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

        {/* Line 2: Year + Your Role + Deliverables + Priority Rank */}
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

          <div className="lg:col-span-4">
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

          <div className="lg:col-span-4">
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

      {/* Clean Bottom Submit Bar — Publish/Draft Toggle + Cancel + Save/Publish Action */}
      <div className="flex flex-wrap items-center justify-end gap-4 pt-1">
        {/* Publish / Draft Toggle Switch (No Box, Label on Left, Toggle on Right) */}
        <button
          type="button"
          role="switch"
          aria-checked={isPublished}
          aria-label={isPublished ? "Status: Publish" : "Status: Draft"}
          onClick={() => setIsPublished(!isPublished)}
          className={`group inline-flex items-center gap-2.5 h-10 px-1 font-mono-custom text-xs uppercase tracking-wider transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg ${
            isPublished
              ? "text-emerald-400 hover:text-emerald-300"
              : "text-amber-400 hover:text-amber-300"
          }`}
        >
          <span className="min-w-[56px] text-right font-medium">
            {isPublished ? "Publish" : "Draft"}
          </span>
          <span
            aria-hidden="true"
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200 ${
              isPublished
                ? "bg-emerald-500 border-emerald-400"
                : "bg-white/12 border-white/20"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200 ${
                isPublished
                  ? "translate-x-4 bg-black shadow-xs"
                  : "translate-x-0.5 bg-amber-400"
              }`}
            />
          </span>
        </button>

        <Link
          href={shared.returnUrl}
          onClick={(e) => {
            if (isEdit) {
              e.preventDefault();
              markAdminReturnScrollRestore(projectId);
              router.push(getSavedAdminReturnUrl(discipline));
            }
          }}
          className={buttonVariants({
            variant: "secondary",
            size: "default",
            className: "flex-1 sm:flex-initial justify-center px-5 py-2.5 h-10 text-xs",
          })}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 sm:flex-initial w-[132px] min-w-[132px] justify-center px-5 py-2.5 h-10 text-xs"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden="true" />
              <span>{isPublished ? "Publishing..." : "Saving..."}</span>
            </>
          ) : (
            <span>{isPublished ? "Publish" : "Save"}</span>
          )}
        </Button>
      </div>
    </>
  );
}
