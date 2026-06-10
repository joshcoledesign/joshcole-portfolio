"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ── EDIT THIS LIST ────────────────────────────────────────────
// Add, remove, or reorder freely.
// Statuses: "done" | "active" | "queued"
// "done" items need an href to link to. Only one "active" at a time.
type QueueItem =
  | { name: string; status: "done"; href: string }
  | { name: string; status: "active" | "queued" };

const QUEUE: QueueItem[] = [
  { name: "novensia", status: "done", href: "/volumes/ai-systems/novensia" },
  { name: "ust-rfp-agent", status: "done", href: "/volumes/ai-systems/ust-rfp-agent" },
  { name: "vrc-suite", status: "done", href: "/volumes/ux-enterprise/vrc-suite" },
  { name: "gprs-sitemap", status: "done", href: "/volumes/ux-enterprise/gprs-sitemap" },
  { name: "lp-7d-ride", status: "done", href: "/volumes/creative-immersive/lp-7d-ride" },
  { name: "union-station-hotel", status: "done", href: "/volumes/creative-immersive/union-station-hotel" },
  { name: "create-case-studies", status: "active" },
  { name: "hype-js", status: "queued" },
];

// Earmarked for Brand Voice Engine pipeline stage states (analyzing / generating / QC). Removed from homepage manifest — no async state in a tree listing.
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function BuildQueue() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setFrame((f) => (f + 1) % SPINNER.length),
      80,
    );
    return () => clearInterval(id);
  }, []);

  const done = QUEUE.filter((i) => i.status === "done").length;
  const active = QUEUE.filter((i) => i.status === "active").length;
  const queued = QUEUE.filter((i) => i.status === "queued").length;

  return (
    <div
      style={{
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 13,
        lineHeight: 1.8,
        marginTop: 20,
        padding: "14px 16px",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 5,
        backgroundColor: "rgba(16,17,23,0.5)",
      }}
    >
      {/* ── Prompt line ── */}
      <div>
        <span style={{ color: "#6a6a70" }}>PS H:\portfolio&gt;&nbsp;</span>
        <span style={{ color: "#e8e8ea" }}>pnpm build</span>
      </div>

      <div style={{ height: 6 }} />

      {/* ── Queue items ── */}
      {QUEUE.map((item) => (
        <div key={item.name} style={{ paddingLeft: 8 }}>
          {item.status === "done" && (
            <Link
              href={(item as { href: string }).href}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "inline-flex",
                alignItems: "baseline",
              }}
            >
              <span style={{ color: "#FF419F" }}>✓</span>
              <span className="build-queue-link" style={{ color: "#5a5a60", marginLeft: 6 }}>
                {item.name}
              </span>
            </Link>
          )}
          {item.status === "active" && (
            <>
              <span style={{ color: "#26c5ff", display: "inline-block", width: 10, textAlign: "center" }}>
                {SPINNER[frame]}
              </span>
              <span style={{ color: "#e8e8ea", marginLeft: 6 }}>
                {item.name}
              </span>
              <span style={{ color: "#26c5ff", marginLeft: 8 }}>
                installing...
              </span>
            </>
          )}
          {item.status === "queued" && (
            <>
              <span style={{ color: "#3c3c43" }}>○</span>
              <span style={{ color: "#3c3c43", marginLeft: 6 }}>
                {item.name}
              </span>
            </>
          )}
        </div>
      ))}

      {/* ── Summary line ── */}
      <div style={{ height: 10 }} />
      <div style={{ color: "#6a6a70", fontSize: 12, paddingLeft: 8 }}>
        {done} compiled
        {active > 0 && <> · {active} building</>}
        {queued > 0 && <> · {queued} queued</>}
      </div>
    </div>
  );
}
