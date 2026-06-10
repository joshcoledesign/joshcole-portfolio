// ─── CommitLog ────────────────────────────────────────────────
// git log --oneline readout for the About page.
// Fetches from GitHub API at build time; falls back to a manual
// array so the build never breaks.

const MONO = "var(--font-jetbrains-mono), monospace";

// ── Fallback commits — used when fetch fails or repo is private ──
// TODO: switch to live fetch once joshcoledesign/joshcole-portfolio is public
const FALLBACK_COMMITS = [
  { hash: "dfe23fb", message: "Add terminal build queue to homepage" },
  { hash: "5b08de7", message: "Add GPRS SiteMap case study images and rename chapters heading" },
  { hash: "44b6f6f", message: "Add USH and VRC case study images with inline photo embeds" },
  { hash: "4869dec", message: "Add LP 7D Ride case study images" },
  { hash: "442993d", message: "Split frontmatter image into independent thumbnail and heroImage fields" },
];

interface Commit {
  hash: string;
  message: string;
}

async function fetchCommits(): Promise<Commit[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/joshcoledesign/joshcole-portfolio/commits?per_page=5",
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 }, // rebuild hourly
      },
    );
    if (!res.ok) return FALLBACK_COMMITS;
    const data = await res.json();
    return data.map((c: { sha: string; commit: { message: string } }) => ({
      hash: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0], // first line only
    }));
  } catch {
    return FALLBACK_COMMITS;
  }
}

export async function CommitLog() {
  // TODO: live fetch is active — falls back to FALLBACK_COMMITS on failure
  const commits = await fetchCommits();

  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 13,
        lineHeight: 1.7,
        padding: "14px 16px",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 5,
        backgroundColor: "rgba(16,17,23,0.5)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Faint scanline overlay */}
      <div
        aria-hidden="true"
        className="panel-crt"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.3,
        }}
      />

      <div className="commit-log-body" style={{ position: "relative", zIndex: 3 }}>
        {/* Command */}
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "#6a6a70" }}>{">"} </span>
          <span
            style={{
              color: "#26c5ff",
              textShadow: "0 0 1px rgba(38,197,255,0.4)",
            }}
          >
            git log --oneline -5
          </span>
        </div>

        {/* Commits */}
        {commits.map((c) => (
          <div
            key={c.hash}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ color: "#5a5a60" }}>{c.hash}</span>
            <span style={{ color: "#e8e8ea", marginLeft: "2ch" }}>
              {c.message}
            </span>
          </div>
        ))}

        {/* Access offer */}
        <div style={{
          marginTop: 8,
          paddingBottom: 10,
          color: "#5a5a60",
          fontStyle: "italic",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          # private repos (brand-voice-engine + others) available on request
        </div>
      </div>
    </div>
  );
}
