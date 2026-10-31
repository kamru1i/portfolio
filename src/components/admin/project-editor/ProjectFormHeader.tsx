"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Globe } from "lucide-react";
import { ProjectType } from "@/types/project";
import { buttonVariants } from "@/components/ui/button";
import {
  getSavedAdminReturnUrl,
  markAdminReturnScrollRestore,
} from "./useProjectSharedForm";

interface ProjectFormHeaderProps {
  discipline: ProjectType;
  isEdit: boolean;
  projectId?: string;
}

export function ProjectFormHeader({
  discipline,
  isEdit,
  projectId,
}: ProjectFormHeaderProps) {
  const router = useRouter();
  const isVideo = discipline === "video";
  const cancelHref = `/admin?tab=${discipline}`;

  return (
    <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 sm:mt-0 ${
            isVideo
              ? "bg-sky-500/15 border-sky-500/25 text-sky-400"
              : "bg-purple-500/15 border-purple-500/25 text-purple-400"
          }`}
        >
          {isVideo ? (
            <Film className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Globe className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h1 className="font-gambarino text-2xl sm:text-3xl text-white font-normal uppercase tracking-tight">
              {isEdit
                ? isVideo
                  ? "Edit Video Project"
                  : "Edit Web Project"
                : isVideo
                ? "Create Video Project"
                : "Create Web Project"}
            </h1>
            {projectId && (
              <span className="font-mono-custom text-[11px] text-[#666]">
                ID: {projectId.slice(0, 8)}...
              </span>
            )}
          </div>
          <p className="font-mono-custom text-xs text-[#888] mt-0.5 line-clamp-2 sm:truncate">
            {isVideo
              ? "Editorial video showcase layout, aspect ratio, thumbnail & case study details."
              : "Web application links, optimized hero screenshot & case study details."}
          </p>
        </div>
      </div>

      <Link
        href={cancelHref}
        onClick={(e) => {
          if (isEdit) {
            e.preventDefault();
            markAdminReturnScrollRestore(projectId);
            router.push(getSavedAdminReturnUrl(discipline));
          }
        }}
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "shrink-0",
        })}
      >
        Cancel
      </Link>
    </div>
  );
}
