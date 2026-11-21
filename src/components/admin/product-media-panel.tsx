"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  deleteProductImage,
  uploadProductImage,
  type ImageUploadState,
} from "@/app/admin/actions";
import { MAX_IMAGES_PER_PRODUCT, MAX_IMAGE_BYTES } from "@/lib/images/rules";
import type { ProductImageValue } from "@/lib/admin/product-form";

/**
 * Product media panel.
 *
 * Uploads go to the server action, which verifies the file's actual bytes and
 * stores it under a generated name. Nothing here is trusted: the client-side
 * checks below exist to give the owner a fast, clear message, not to enforce
 * anything — the server repeats every one of them.
 *
 * The image list is part of the product form, so adding or removing a photo
 * only takes effect when the owner saves. That keeps a single write path for
 * catalogue changes and means an abandoned edit leaves no stray state.
 */
export function ProductMediaPanel({
  images,
  onChange,
  productId,
  readOnly,
}: {
  images: ProductImageValue[];
  onChange: (images: ProductImageValue[]) => void;
  productId: string;
  readOnly: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();
  const [notice, setNotice] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();
  const [uploadState, setUploadState] = useState<ImageUploadState>({});

  const full = images.length >= MAX_IMAGES_PER_PRODUCT;

  function handleUpload(file: File) {
    setError(undefined);
    setNotice(undefined);

    // A courtesy check so an obviously wrong file never leaves the browser.
    // The server repeats all of this and is the authority.
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setError("Use a JPEG, PNG, WebP or AVIF image. SVG files are not accepted.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images must be under 8 MB. Compress the photo and try again.");
      return;
    }
    if (full) {
      setError(`A product can have at most ${MAX_IMAGES_PER_PRODUCT} images. Remove one first.`);
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("productId", productId || "unassigned");
    formData.set("imageCount", String(images.length));

    startTransition(async () => {
      const result = await uploadProductImage({}, formData);
      setUploadState(result);
      if (!result.ok || !result.image) {
        setError(result.error ?? "The image could not be uploaded.");
        return;
      }
      onChange([...images, result.image]);
      setNotice("Image uploaded. Save the product to keep it.");
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  /**
   * Removal is immediate and also deletes the stored object.
   *
   * The alternative — drop the reference now, delete the file after saving —
   * leaves an orphaned file in storage every time an owner changes their mind,
   * and storage is the one resource that quietly accumulates cost. The trade-off
   * is that a removed photo is gone without a save, so the button says so.
   */
  function handleRemove(src: string) {
    setError(undefined);
    setNotice(undefined);

    onChange(images.filter((image) => image.src !== src));

    const formData = new FormData();
    formData.set("src", src);
    formData.set("productId", productId);

    startTransition(async () => {
      try {
        await deleteProductImage(formData);
        setNotice("Photo removed.");
      } catch {
        // The product no longer references it; if the file lingered, that is a
        // tidiness problem, not a broken page.
        setNotice("Photo removed from this product.");
      }
    });
  }

  function updateAlt(index: number, field: "altEn" | "altMs" | "altZh", value: string) {
    onChange(images.map((image, position) =>
      position === index ? { ...image, [field]: value } : image,
    ));
  }

  return (
    <section className="border border-[color:var(--color-line)] bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
          Photos
        </h2>
        <p className="text-[0.6875rem] text-[color:var(--color-mist)]">
          {images.length} of {MAX_IMAGES_PER_PRODUCT}
        </p>
      </div>

      <p className="mt-1 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
        At least one photo is required before a product can be published. JPEG, PNG,
        WebP or AVIF, up to 8 MB.
      </p>

      {images.length === 0 ? (
        <p className="mt-4 border-l-2 border-[color:var(--color-clay)] bg-[color:var(--color-cream)]/60 px-3 py-2 text-[0.8125rem] text-[color:var(--color-ink-body)]">
          No photos yet. This product cannot be published until one is added.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {images.map((image, index) => (
            <li
              key={`${image.src}-${index}`}
              className="grid gap-4 border border-[color:var(--color-line)] p-3 sm:grid-cols-[7rem_1fr]"
            >
              <div className="relative h-28 w-28 overflow-hidden bg-[color:var(--color-surface-sunken)]">
                {/* `unoptimized` for repository paths so a build-time asset is
                    never sent through the optimiser with a query string. */}
                <Image
                  src={image.src}
                  alt={image.altEn || ""}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-3">
                  <AltField
                    label="Alt text (English)"
                    value={image.altEn}
                    onChange={(value) => updateAlt(index, "altEn", value)}
                    required
                  />
                  <AltField
                    label="Alt text (Malay)"
                    value={image.altMs}
                    onChange={(value) => updateAlt(index, "altMs", value)}
                  />
                  <AltField
                    label="Alt text (Chinese)"
                    value={image.altZh}
                    onChange={(value) => updateAlt(index, "altZh", value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <p className="truncate text-[0.6875rem] text-[color:var(--color-mist)]" title={image.src}>
                    {image.placeholder ? "Temporary illustration" : image.src}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(image.src)}
                    className="text-[0.75rem] text-[#a8442c] underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* The list travels with the form so saving persists it. */}
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />

      <div className="mt-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={readOnly || pending || full}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="block w-full cursor-pointer border border-[color:var(--color-line-strong)] bg-white p-2 text-[0.8125rem] file:mr-3 file:border-0 file:bg-[color:var(--color-cream)] file:px-3 file:py-1.5 file:text-[0.75rem] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {readOnly ? (
        <p className="mt-2 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
          Uploads are disabled while the catalogue is read-only.
        </p>
      ) : null}

      {pending ? (
        <p className="mt-2 text-[0.75rem] text-[color:var(--color-ink-muted)]" role="status">
          Uploading…
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 border-l-2 border-[#a8442c] px-2 text-[0.8125rem] text-[#a8442c]" role="alert">
          {error}
        </p>
      ) : null}

      {!error && (notice || uploadState.ok) ? (
        <p className="mt-2 text-[0.8125rem] text-[#41593a]" role="status">
          {notice ?? "Image uploaded."}
        </p>
      ) : null}
    </section>
  );
}

function AltField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[0.6875rem] font-medium text-[color:var(--color-ink-strong)]">
        {label}
        {required ? <span className="ml-0.5 text-[color:var(--color-cognac)]">*</span> : null}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full border border-[color:var(--color-line-strong)] bg-white px-2 py-1.5 text-[0.8125rem]"
      />
    </label>
  );
}
