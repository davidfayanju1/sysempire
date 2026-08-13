// Product photos are served from Cloudinary as unmodified originals — often
// full camera resolution regardless of where they're displayed. Cloudinary
// supports on-the-fly transforms via URL segments (no backend change, no
// build step), so we rewrite delivery URLs to request an appropriately
// sized, auto-format/auto-quality variant instead of the original upload.
//
// This is the actual fix for CDN-hosted images: vite-imagetools and similar
// build-time tools only touch files Vite bundles — they can't do anything to
// a URL fetched from a remote API at runtime.

const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";

type CloudinaryCrop = "fill" | "limit" | "fit" | "thumb" | "scale";

interface CloudinaryTransformOptions {
  /** Target width in px. Pick ~2x the CSS display size for retina. */
  width?: number;
  /** Target height in px — pair with width + crop:"fill" for hard crops. */
  height?: number;
  /**
   * "limit" (default): scale down to fit, never upscale, keep aspect ratio —
   * use when a CSS `object-cover` container is already doing the cropping.
   * "fill": hard crop to exact width x height — use for fixed-box thumbnails.
   */
  crop?: CloudinaryCrop;
}

/**
 * Rewrites a Cloudinary delivery URL to request a resized, auto-format
 * (`f_auto` → WebP/AVIF where supported), auto-quality (`q_auto`) variant.
 *
 * Safe no-op for anything that isn't a Cloudinary `/image/upload/` URL
 * (local assets, placeholder strings, other hosts) — returns it unchanged
 * rather than guessing at a transform that wouldn't apply.
 */
export const cldImage = (
  url: string | undefined,
  { width, height, crop = "limit" }: CloudinaryTransformOptions = {},
): string => {
  if (!url) return url ?? "";

  const markerIndex = url.indexOf(CLOUDINARY_UPLOAD_MARKER);
  if (markerIndex === -1) return url;

  const transforms = [
    "f_auto",
    "q_auto",
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    width || height ? `c_${crop}` : null,
  ]
    .filter(Boolean)
    .join(",");

  const insertAt = markerIndex + CLOUDINARY_UPLOAD_MARKER.length;
  return `${url.slice(0, insertAt)}${transforms}/${url.slice(insertAt)}`;
};
