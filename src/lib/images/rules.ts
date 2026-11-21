import type { Product } from "@/content/types";

/**
 * Product image rules.
 *
 * Uploading files from a browser is the highest-risk endpoint in this
 * application, so the checks live here, in plain functions, rather than inside
 * the server action where they would be hard to test.
 *
 * The rules exist because a naive upload endpoint will happily accept a 50 MB
 * SVG containing script, store it under a predictable name, and serve it from
 * the shop's own domain. Each check below closes one of those doors.
 */

/** 8 MB. Comfortably above a phone photo after Next compresses it, far below disaster. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Products may carry at most this many images, counted across colours. */
export const MAX_IMAGES_PER_PRODUCT = 6;

/**
 * Only formats a browser can safely render as an image.
 *
 * **SVG is deliberately excluded.** An SVG is a document that can contain
 * `<script>`, and serving one from our own origin would be a stored XSS with
 * the shop's domain on it. There is no legitimate need for it in a product
 * photo.
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export interface ImageUploadInput {
  /** As reported by the browser. Not trusted; checked against magic bytes too. */
  type: string;
  /** Byte length of the file. */
  size: number;
  /** The first bytes of the file, used to verify the real format. */
  header: Uint8Array;
}

export type ImageRejection =
  | "empty"
  | "too-large"
  | "unsupported-type"
  | "content-mismatch";

export interface ImageValidation {
  ok: boolean;
  rejection?: ImageRejection;
  /** Human-readable reason, safe to show the owner. */
  message?: string;
}

/**
 * The magic bytes for each allowed format.
 *
 * The declared `type` comes from the client and can be anything, so the file's
 * own header is the only trustworthy signal. Without this check an upload
 * endpoint can be handed a `.php`, a zip bomb or a script and told it is a JPEG.
 */
const SIGNATURES: { type: AllowedImageType; test: (bytes: Uint8Array) => boolean }[] = [
  {
    type: "image/jpeg",
    // FF D8 FF
    test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    type: "image/png",
    // 89 50 4E 47 0D 0A 1A 0A
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    type: "image/webp",
    // "RIFF" .... "WEBP"
    test: (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  {
    type: "image/avif",
    // "....ftypavif" or "....ftypavis"
    test: (b) =>
      b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70 &&
      b[8] === 0x61 && b[9] === 0x76 && b[10] === 0x69 &&
      (b[11] === 0x66 || b[11] === 0x73),
  },
];

/** Detect the real format from the file's own bytes. */
export function detectImageType(header: Uint8Array): AllowedImageType | null {
  for (const signature of SIGNATURES) {
    if (signature.test(header)) return signature.type;
  }
  return null;
}

/**
 * Validate an upload.
 *
 * Order matters: cheap checks first, and the content check last so a rejected
 * file is never read further than its header.
 */
export function validateImageUpload(input: ImageUploadInput): ImageValidation {
  if (input.size <= 0) {
    return { ok: false, rejection: "empty", message: "That file is empty." };
  }

  if (input.size > MAX_IMAGE_BYTES) {
    const megabytes = (MAX_IMAGE_BYTES / (1024 * 1024)).toFixed(0);
    return {
      ok: false,
      rejection: "too-large",
      message: `Images must be under ${megabytes} MB. Compress the photo and try again.`,
    };
  }

  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(input.type)) {
    return {
      ok: false,
      rejection: "unsupported-type",
      message: "Use a JPEG, PNG, WebP or AVIF image. SVG files are not accepted.",
    };
  }

  const detected = detectImageType(input.header);
  if (!detected) {
    return {
      ok: false,
      rejection: "content-mismatch",
      message: "That file is not a readable image, whatever its name suggests.",
    };
  }

  if (detected !== input.type) {
    // A file claiming to be one format and actually being another is either a
    // mistake or an attempt. Either way it is refused.
    return {
      ok: false,
      rejection: "content-mismatch",
      message: "The file's contents do not match its type. Try re-exporting the image.",
    };
  }

  return { ok: true };
}

/* ------------------------------ Storage paths ----------------------------- */

/**
 * Build the storage object path for a product image.
 *
 * Everything is derived from data we control — a slugified product id, a
 * random suffix, and an extension chosen from the *verified* type. The
 * original filename is never used, so `../../etc/passwd` or a 300-character
 * Unicode name cannot influence where the file lands or what it is called.
 */
export function imageStoragePath(
  productId: string,
  extensionFor: AllowedImageType,
  suffix: string,
): string {
  const safeId = slugifySegment(productId) || "product";
  const safeSuffix = slugifySegment(suffix).slice(0, 16) || "img";
  return `${safeId}/${safeSuffix}.${extensionFor.split("/")[1]}`;
}

/** Lowercase letters, digits and single hyphens. */
function slugifySegment(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/* ------------------------------- Product images --------------------------- */

/**
 * Apply an upload to a product's image list.
 *
 * A product needs at least one image to publish, so the editor shows the list
 * and allows removing an image — but removing the last one will block
 * publishing, which the form already explains.
 */
export function withImage(
  product: Pick<Product, "images">,
  image: Product["images"][number],
): Pick<Product, "images"> {
  if (product.images.length >= MAX_IMAGES_PER_PRODUCT) return product;
  return { ...product, images: [...product.images, image] };
}

export function withoutImage(
  product: Pick<Product, "images">,
  src: string,
): Pick<Product, "images"> {
  return { ...product, images: product.images.filter((image) => image.src !== src) };
}

/**
 * Whether an image `src` is one of ours.
 *
 * Public storage URLs are fine; anything else is refused, so a product cannot
 * be pointed at an attacker's server to serve unexpected content through the
 * shop's image component.
 */
export function isOwnStorageUrl(src: string, publicBaseUrl: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true; // a repository-hosted image
  const base = publicBaseUrl.replace(/\/+$/, "");
  return base.length > 0 && src.startsWith(`${base}/`);
}
