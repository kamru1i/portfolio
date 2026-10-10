/**
 * Shared layout constants and utility tokens for portfolio preview and player modals.
 * Standardizes outer dialog height, viewport-aware bounds, and backdrop positioning
 * across Web previews (iframe & fallback) and Video players (16:9, 9:16, 1:1, 4:3, 5:4).
 */

export const MODAL_BACKDROP_CLASSES =
  "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pt-24 sm:pt-24 md:pt-24 pb-4 sm:pb-6 bg-black/85 backdrop-blur-md overflow-hidden";

export const MODAL_OUTER_SHELL_CLASSES =
  "relative w-full max-w-5xl xl:max-w-6xl h-[76vh] h-[76dvh] max-h-[720px] min-h-[380px] sm:min-h-[460px] rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto";

export const MODAL_VIDEO_SHELL_CLASSES =
  "relative w-full max-w-5xl h-[76vh] h-[76dvh] max-h-[720px] min-h-[380px] sm:min-h-[460px] rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto";

/**
 * Truncates title to approximately maxWords (default: 5) words with an ellipsis.
 * Preserves the original title string intact for accessible title and aria-label attributes.
 */
export function getTruncatedModalTitle(title: string, maxWords: number = 5): string {
  if (!title) return "";
  const words = title.trim().split(/\s+/);
  if (words.length <= maxWords) return title;
  return words.slice(0, maxWords).join(" ") + "…";
}

/**
 * Resolves the display attribution for a project:
 * Displays client or company name when present, falling back to 'Personal Project'.
 * Never replaces attribution with format strings.
 */
export function getProjectAttribution(project: { client?: string }): string {
  if (project.client && project.client.trim().length > 0) {
    return project.client.trim();
  }
  return "Personal Project";
}

export function getAspectRatioMultiplier(format?: string): number {
  switch (format) {
    case "9:16":
      return 9 / 16;
    case "1:1":
      return 1;
    case "4:3":
      return 4 / 3;
    case "5:4":
      return 5 / 4;
    case "16:9":
    default:
      return 16 / 9;
  }
}

export interface ModalDimensions {
  modalWidth: number;
  modalHeight: number;
  mediaWidth: number;
  mediaHeight: number;
  ratio: number;
}

/**
 * Computes responsive aspect-ratio-derived modal shell dimensions.
 * For any format (16:9, 9:16, 1:1, 4:3, 5:4), the outer height matches the
 * shared modal height strategy, while the modal width adapts to the media's
 * configured aspect ratio (mediaWidth = availableMediaHeight * aspectRatio).
 */
export function computeAspectModalDimensions(
  format?: string,
  viewportWidth: number = 1920,
  viewportHeight: number = 1080
): ModalDimensions {
  const headerHeight = 52;
  const paddingX = viewportWidth < 640 ? 24 : 32;
  const maxViewportW = Math.max(320, viewportWidth - paddingX);

  // Outer modal height matches the shared strategy: min(720px, 76dvh)
  const targetMaxModalH = Math.min(720, Math.round(viewportHeight * 0.76));
  const maxAvailableMediaH = Math.max(200, targetMaxModalH - headerHeight);

  const ratio = getAspectRatioMultiplier(format);

  // If screen width constrains the video, scale media height down proportionally
  const maxMediaHFromWidth = maxViewportW / ratio;
  const mediaHeight = Math.round(Math.min(maxAvailableMediaH, maxMediaHFromWidth));
  const mediaWidth = Math.round(mediaHeight * ratio);

  // Minimum header width so controls fit gracefully
  const minHeaderW = Math.min(maxViewportW, format === "9:16" ? 360 : 420);
  const modalWidth = Math.max(minHeaderW, mediaWidth);
  const modalHeight = mediaHeight + headerHeight;

  return {
    modalWidth,
    modalHeight,
    mediaWidth,
    mediaHeight,
    ratio,
  };
}
