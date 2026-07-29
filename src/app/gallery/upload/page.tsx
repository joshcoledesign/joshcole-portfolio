"use client";

// ─── /gallery/upload ──────────────────────────────────────────
// Drag-and-drop uploader. Files go straight from the browser to
// Vercel Blob via a scoped token minted by /api/gallery/upload.
// Unprotected for now — see the roadmap note in the gallery README.

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import { PromptLine } from "@/components/prompt-line";

const MONO = "var(--font-jetbrains-mono), monospace";
const SYNE = "var(--font-syne), sans-serif";
const INTER = "var(--font-inter), system-ui, sans-serif";

type ItemStatus = "queued" | "uploading" | "done" | "error";

interface UploadItem {
  id: string;
  name: string;
  status: ItemStatus;
  error?: string;
}

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadKey, setUploadKey] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);

  const unlocked = uploadKey.trim().length > 0;

  const update = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (files.length === 0) return;
      if (!uploadKey.trim()) return;

      const queued: UploadItem[] = files.map((f) => ({
        id: `${counter.current++}-${f.name}`,
        name: f.name,
        status: "queued",
      }));
      setItems((prev) => [...queued, ...prev]);
      setBusy(true);

      // Upload sequentially — keeps the UI legible and avoids hammering.
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { id } = queued[i];
        update(id, { status: "uploading" });
        try {
          await upload(`gallery/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/gallery/upload",
            contentType: file.type,
            clientPayload: uploadKey,
          });
          update(id, { status: "done" });
        } catch (err) {
          update(id, { status: "error", error: (err as Error).message });
        }
      }

      setBusy(false);
    },
    [update, uploadKey],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const doneCount = items.filter((it) => it.status === "done").length;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 56 }}>
      <PromptLine href="/" />
      <div
        className="page-container"
        style={{ maxWidth: 720, margin: "0 auto", padding: "64px 48px 0" }}
      >
        {/* ── Back link ── */}
        <Link
          href="/gallery"
          className="case-back-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 12,
            color: "#6a6a70",
            textDecoration: "none",
            letterSpacing: "0.04em",
            marginBottom: 40,
          }}
        >
          <span aria-hidden="true">&lt;</span>
          <span>Back to Gallery</span>
        </Link>

        {/* ── Header ── */}
        <h1
          className="page-title"
          style={{ fontFamily: SYNE, fontWeight: 600, lineHeight: 1.07, color: "#e8e8ea", margin: "0 0 8px" }}
        >
          Upload
        </h1>
        <div style={{ fontFamily: MONO, fontSize: 14, color: "#26c5ff", marginBottom: 32 }}>
          ./gallery --add
        </div>

        {/* ── Upload key ── */}
        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="upload-key"
            style={{
              display: "block",
              fontFamily: MONO,
              fontSize: 12,
              color: "#6a6a70",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            UPLOAD KEY
          </label>
          <input
            id="upload-key"
            type="password"
            autoComplete="off"
            value={uploadKey}
            onChange={(e) => setUploadKey(e.target.value)}
            placeholder="enter key to unlock uploads"
            style={{
              width: "100%",
              fontFamily: MONO,
              fontSize: 14,
              color: "#e8e8ea",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.18)",
              padding: "12px 14px",
              outline: "none",
            }}
          />
        </div>

        {/* ── Drop zone ── */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (unlocked) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={unlocked ? onDrop : (e) => e.preventDefault()}
          onClick={() => unlocked && inputRef.current?.click()}
          role="button"
          aria-disabled={!unlocked}
          tabIndex={unlocked ? 0 : -1}
          onKeyDown={(e) => {
            if (unlocked && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
          }}
          style={{
            border: `1px dashed ${dragging ? "#26c5ff" : "rgba(255,255,255,0.18)"}`,
            background: dragging ? "rgba(38,197,255,0.05)" : "rgba(255,255,255,0.015)",
            padding: "56px 32px",
            textAlign: "center",
            cursor: unlocked ? "pointer" : "not-allowed",
            opacity: unlocked ? 1 : 0.5,
            transition: "border-color 0.15s ease, background 0.15s ease, opacity 0.15s ease",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 14, color: "#e8e8ea", marginBottom: 8 }}>
            {!unlocked ? "Enter the upload key to unlock" : dragging ? "Release to upload" : "Drop images here"}
          </div>
          <div style={{ fontFamily: INTER, fontSize: 14, color: "#6a6a70" }}>
            or click to browse — JPG, PNG, WebP, GIF, AVIF · up to 25 MB each
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {/* ── Queue ── */}
        {items.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: "#6a6a70",
                letterSpacing: "0.06em",
                marginBottom: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>QUEUE</span>
              <span>
                {doneCount}/{items.length} done
              </span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((it) => (
                <li
                  key={it.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "10px 0",
                    borderBottom: "0.5px solid rgba(255,255,255,0.08)",
                    fontFamily: MONO,
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      color: "#acacb1",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {it.name}
                  </span>
                  <span style={{ flexShrink: 0, color: STATUS_COLOR[it.status] }} title={it.error}>
                    {STATUS_LABEL[it.status]}
                  </span>
                </li>
              ))}
            </ul>

            {!busy && doneCount > 0 && (
              <Link
                href="/gallery"
                style={{
                  display: "inline-block",
                  marginTop: 24,
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#26c5ff",
                }}
              >
                View gallery →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<ItemStatus, string> = {
  queued: "queued",
  uploading: "uploading…",
  done: "✓ done",
  error: "✗ error",
};

const STATUS_COLOR: Record<ItemStatus, string> = {
  queued: "#6a6a70",
  uploading: "#26c5ff",
  done: "#5fd38d",
  error: "#ff5e54",
};
