import Link from "next/link";
import { PromptLine } from "@/components/prompt-line";

export default function NotFound() {
  return (
    <div style={{ minHeight: "70vh" }}>
      <PromptLine href="/" command="./404" flag="--not-found" />
      <main
        style={{
          boxSizing: "border-box",
          width: "min(100%, 960px)",
          margin: "0 auto",
          padding: "72px 48px",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#8a8a90",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.12em",
          }}
        >
          404 · PATH NOT FOUND
        </p>
        <h1
          style={{
            margin: "0 0 24px",
            color: "#e8e8ea",
            fontFamily: "var(--font-syne), sans-serif",
            fontSize: "clamp(36px, 7vw, 64px)",
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          Nothing is mapped here.
        </h1>
        <Link className="case-prose-link" href="/">
          &lt; cd /home
        </Link>
      </main>
    </div>
  );
}
