/**
 * Client-side image optimization utility for Admin CMS uploads.
 * Resizes large screenshots/thumbnails to a maximum dimension (default 1920px)
 * while preserving aspect ratio, and encodes to WebP (quality 0.84) for
 * fast, lag-free rendering across project cards and preview modals.
 */

export interface OptimizedImageResult {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  optimizedBytes: number;
}

const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.84;

export async function optimizeImageBeforeUpload(
  inputFile: File,
  filenamePrefix: "video-thumbnail" | "web-screenshot" = "web-screenshot"
): Promise<OptimizedImageResult> {
  const originalBytes = inputFile.size;

  // Skip non-browser environments
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      file: inputFile,
      width: 0,
      height: 0,
      originalBytes,
      optimizedBytes: originalBytes,
    };
  }

  return new Promise<OptimizedImageResult>((resolve) => {
    const objectUrl = URL.createObjectURL(inputFile);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const srcWidth = img.naturalWidth || img.width;
      const srcHeight = img.naturalHeight || img.height;

      if (!srcWidth || !srcHeight) {
        resolve({
          file: inputFile,
          width: 0,
          height: 0,
          originalBytes,
          optimizedBytes: originalBytes,
        });
        return;
      }

      // Compute target dimensions capped at MAX_DIMENSION without upscaling
      let targetWidth = srcWidth;
      let targetHeight = srcHeight;

      if (srcWidth > MAX_DIMENSION || srcHeight > MAX_DIMENSION) {
        if (srcWidth >= srcHeight) {
          targetWidth = MAX_DIMENSION;
          targetHeight = Math.round((srcHeight * MAX_DIMENSION) / srcWidth);
        } else {
          targetHeight = MAX_DIMENSION;
          targetWidth = Math.round((srcWidth * MAX_DIMENSION) / srcHeight);
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({
          file: inputFile,
          width: srcWidth,
          height: srcHeight,
          originalBytes,
          optimizedBytes: originalBytes,
        });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              file: inputFile,
              width: srcWidth,
              height: srcHeight,
              originalBytes,
              optimizedBytes: originalBytes,
            });
            return;
          }

          // If original was already WebP/AVIF and smaller than re-encoded blob (and wasn't resized), keep original
          const wasResized = targetWidth !== srcWidth || targetHeight !== srcHeight;
          if (!wasResized && blob.size >= originalBytes && inputFile.type === "image/webp") {
            resolve({
              file: inputFile,
              width: srcWidth,
              height: srcHeight,
              originalBytes,
              optimizedBytes: originalBytes,
            });
            return;
          }

          const baseStem = inputFile.name
            ? inputFile.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9-_]/g, "-")
            : filenamePrefix;
          const cleanStem =
            baseStem && baseStem !== "image" && baseStem !== "blob"
              ? baseStem
              : `${filenamePrefix}-${Date.now()}`;

          const optimizedFile = new File([blob], `${cleanStem}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve({
            file: optimizedFile,
            width: targetWidth,
            height: targetHeight,
            originalBytes,
            optimizedBytes: optimizedFile.size,
          });
        },
        "image/webp",
        WEBP_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        file: inputFile,
        width: 0,
        height: 0,
        originalBytes,
        optimizedBytes: originalBytes,
      });
    };

    img.src = objectUrl;
  });
}
