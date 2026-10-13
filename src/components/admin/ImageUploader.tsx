"use client";

import { useRef, useState } from "react";

/** Keep in sync with UPLOAD_FOLDER in @/lib/cloudinary (not imported — server-only). */
const DEFAULT_FOLDER = "tuc/uploads";

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";
const LABEL = "field-label block";

/** Cloudinary's free plan caps a single image at 10 MB. */
const MAX_BYTES = 10 * 1024 * 1024;

type UploadStatus = {
  active: boolean;
  done: number;
  total: number;
  progress: number;
  error: string | null;
};

type SignResponse = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
};

/** Ask the server to sign, then stream one file straight to Cloudinary. */
function uploadOne(
  file: File,
  folder: string,
  onProgress: (fraction: number) => void,
): Promise<string> {
  return fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  }).then(async (res) => {
    if (!res.ok) {
      const detail = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(detail?.error ?? `Uploads are unavailable (${res.status}).`);
    }
    const sign = (await res.json()) as SignResponse;

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sign.apiKey);
    form.append("folder", sign.folder);
    form.append("timestamp", String(sign.timestamp));
    form.append("signature", sign.signature);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total);
      };
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText) as {
            secure_url?: string;
            error?: { message?: string };
          };
          if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject(new Error(data.error?.message ?? `Cloudinary rejected the upload (${xhr.status}).`));
          }
        } catch {
          reject(new Error(`Cloudinary rejected the upload (${xhr.status}).`));
        }
      };
      xhr.onerror = () => reject(new Error("Network error while uploading."));
      xhr.send(form);
    });
  });
}

/**
 * File upload field for any admin form with an image column. Renders a hidden
 * input carrying the resulting URL(s) so it drops into the existing server
 * actions unchanged: newline-separated for galleries, a single URL otherwise.
 */
export function ImageUploader({
  name,
  multiple = false,
  defaultValue = [],
  label,
  hint,
  folder = DEFAULT_FOLDER,
}: {
  name: string;
  multiple?: boolean;
  defaultValue?: string[];
  label?: string;
  hint?: string;
  folder?: string;
}) {
  const [urls, setUrls] = useState<string[]>(() =>
    defaultValue.map((url) => url.trim()).filter(Boolean),
  );
  const [draft, setDraft] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>({
    active: false,
    done: 0,
    total: 0,
    progress: 0,
    error: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const value = multiple ? urls.join("\n") : (urls[0] ?? "");

  function commit(next: string[]) {
    setUrls(multiple ? next : next.slice(-1));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= urls.length) return;
    setUrls((list) => {
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addDraft() {
    const added = draft
      .split(/[\r\n,]+/)
      .map((part) => part.trim())
      .filter(Boolean);
    setDraft("");
    if (!added.length) return;
    commit([...urls, ...added]);
  }

  async function handleFiles(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) {
      setStatus({
        active: false,
        done: 0,
        total: 0,
        progress: 0,
        error: "Choose image files (JPG, PNG or WebP).",
      });
      return;
    }
    const oversized = images.find((file) => file.size > MAX_BYTES);
    if (oversized) {
      setStatus({
        active: false,
        done: 0,
        total: 0,
        progress: 0,
        error: `“${oversized.name}” is over 10 MB. Resize it and try again.`,
      });
      return;
    }

    while (!multiple && urls.length + images.length > 1) images.pop();

    setStatus({ active: true, done: 0, total: images.length, progress: 0, error: null });
    const uploaded: string[] = [];
    try {
      for (let i = 0; i < images.length; i += 1) {
        const url = await uploadOne(images[i], folder, (fraction) =>
          setStatus((s) => ({ ...s, progress: fraction })),
        );
        uploaded.push(url);
        setStatus((s) => ({ ...s, done: i + 1, progress: 0 }));
      }
      commit([...urls, ...uploaded]);
      setStatus({ active: false, done: 0, total: 0, progress: 0, error: null });
    } catch (error) {
      commit([...urls, ...uploaded]);
      setStatus({
        active: false,
        done: 0,
        total: 0,
        progress: 0,
        error: error instanceof Error ? error.message : "Upload failed.",
      });
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={value} />
      {label ? <span className={LABEL}>{label}</span> : null}

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((url, index) => (
            <li
              key={`${index}-${url}`}
              className="overflow-hidden rounded-box border border-line bg-white"
            >
              <div className="relative aspect-[4/3] bg-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={multiple ? `Image ${index + 1}` : "Selected image"}
                  className="h-full w-full object-cover"
                />
                {multiple && index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-pill bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                    Main
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setUrls((list) => list.filter((_, i) => i !== index))}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-danger"
                >
                  <i className="fa-solid fa-xmark" aria-hidden="true" />
                </button>
              </div>
              {multiple ? (
                <div className="flex items-center justify-between border-t border-line-soft px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move image earlier"
                    className="grid h-6 w-6 place-items-center rounded-full text-muted transition-colors hover:bg-alt hover:text-ink disabled:opacity-30"
                  >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                  </button>
                  <span className="text-[12px] text-muted-light">
                    {index === 0 ? "Cover" : `#${index + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === urls.length - 1}
                    aria-label="Move image later"
                    className="grid h-6 w-6 place-items-center rounded-full text-muted transition-colors hover:bg-alt hover:text-ink disabled:opacity-30"
                  >
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(Array.from(event.dataTransfer.files));
        }}
        className={`rounded-box border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragging ? "border-accent bg-sky" : "border-line bg-alt"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void handleFiles(Array.from(event.target.files));
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status.active}
          className="btn btn-secondary btn-sm"
        >
          <i
            className={`fa-solid ${status.active ? "fa-spinner animate-spin" : "fa-cloud-arrow-up"}`}
            aria-hidden="true"
          />
          {status.active
            ? status.total > 1
              ? `Uploading ${status.done + 1} of ${status.total}…`
              : `Uploading… ${Math.max(1, Math.round(status.progress * 100))}%`
            : multiple
              ? "Upload photos"
              : "Upload image"}
        </button>
        <p className="mt-2 text-[13px] text-muted">
          Drag {multiple ? "images" : "an image"} here or click to browse — JPG, PNG or WebP up to 10 MB.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addDraft();
            }
          }}
          placeholder="…or paste an image URL"
          className={FIELD}
        />
        <button type="button" onClick={addDraft} className="btn btn-secondary btn-sm shrink-0">
          Add URL
        </button>
      </div>

      {status.error ? (
        <p className="flex items-start gap-2 text-[13px] text-danger">
          <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
          <span>{status.error}</span>
        </p>
      ) : null}
      {hint ? <p className="text-[12px] text-muted">{hint}</p> : null}
    </div>
  );
}
