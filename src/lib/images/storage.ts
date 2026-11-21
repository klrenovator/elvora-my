import type { AllowedImageType } from "@/lib/images/rules";

/**
 * Image storage boundary.
 *
 * Mirrors the catalogue and order repositories: where files live is a hosting
 * decision, and it should not leak into the admin UI.
 *
 * `SupabaseImageStorage` talks to Supabase Storage over its REST API using the
 * service_role key, which must never reach a browser. It is the only
 * implementation; when it is not configured the admin refuses uploads with an
 * explanation rather than appearing to succeed.
 */

export interface StoredImage {
  /** Absolute public URL, suitable for `next/image` once the host is allowed. */
  url: string;
  /** Path within the bucket, kept so the object can be deleted later. */
  path: string;
}

export interface ImageStorage {
  /** True only when credentials are present and plausible. */
  isConfigured(): boolean;
  /** Whether files survive a restart. Always true for real object storage. */
  isDurable(): boolean;
  upload(path: string, body: Uint8Array, contentType: AllowedImageType): Promise<StoredImage>;
  remove(path: string): Promise<void>;
}

export class ImageStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageStorageError";
  }
}

export const IMAGE_BUCKET = "product-images";

interface SupabaseStorageConfig {
  url: string;
  serviceRoleKey: string;
}

/**
 * Read storage configuration from the environment.
 *
 * Deliberately accepts only the service key, never the anon key: uploading
 * requires write access, and the anon key must not have it. Using the anon key
 * here would either fail or, worse, succeed because someone loosened the bucket
 * policy.
 */
export function storageConfig(): SupabaseStorageConfig | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url: url.replace(/\/+$/, ""), serviceRoleKey };
}

/** The base URL public objects are served from, for validating image sources. */
export function publicImageBase(): string {
  const config = storageConfig();
  if (!config) return "";
  return `${config.url}/storage/v1/object/public/${IMAGE_BUCKET}`;
}

export class SupabaseImageStorage implements ImageStorage {
  isConfigured(): boolean {
    return storageConfig() !== null;
  }

  isDurable(): boolean {
    return true;
  }

  async upload(
    path: string,
    body: Uint8Array,
    contentType: AllowedImageType,
  ): Promise<StoredImage> {
    const config = storageConfig();
    if (!config) {
      throw new ImageStorageError(
        "Image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      );
    }

    // The object path is built from our own slug and a random suffix, never
    // from the uploaded filename — see imageStoragePath().
    const response = await fetch(
      `${config.url}/storage/v1/object/${IMAGE_BUCKET}/${encodeURI(path)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.serviceRoleKey}`,
          "Content-Type": contentType,
          // Never overwrite: an existing object means a name collision, which
          // should be a loud failure rather than a silent replacement.
          "x-upsert": "false",
          "cache-control": "public, max-age=31536000, immutable",
        },
        body: body as unknown as BodyInit,
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new ImageStorageError(
        `The image could not be stored (${response.status}). ${
          response.status === 404
            ? `Create a public bucket named "${IMAGE_BUCKET}" first.`
            : detail.slice(0, 200)
        }`,
      );
    }

    return { url: `${publicImageBase()}/${path}`, path };
  }

  async remove(path: string): Promise<void> {
    const config = storageConfig();
    if (!config) throw new ImageStorageError("Image storage is not configured.");

    const response = await fetch(`${config.url}/storage/v1/object/${IMAGE_BUCKET}/${encodeURI(path)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${config.serviceRoleKey}` },
    });

    // A missing object is not an error for our purposes; the goal is "gone".
    if (!response.ok && response.status !== 404) {
      throw new ImageStorageError(`The image could not be removed (${response.status}).`);
    }
  }
}

let active: ImageStorage = new SupabaseImageStorage();

export function getImageStorage(): ImageStorage {
  return active;
}

/** Test seam. */
export function setImageStorage(storage: ImageStorage): void {
  active = storage;
}

export function resetImageStorage(): void {
  active = new SupabaseImageStorage();
}
