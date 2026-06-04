// ─── Hero doors ───────────────────────────────────────────────
// The three navigation columns. Gradient hairline above, then
// The Thread / The Volumes / About with mono sublabels.
// No persistent top nav on the homepage — these doors ARE the nav.

const DOORS = [
  {
    label: "The Thread",
    sub: "THE PLOT",
    href: "/thread",
  },
  {
    label: "The Volumes",
    sub: "THE CHAPTERS",
    href: "/volumes",
  },
  {
    label: "About",
    sub: "THE AUTHOR",
    href: "/about",
  },
] as const;

export function HeroDoors() {
  return (
    <div className="w-full">
      {/* Full-width brand gradient hairline — 2px per spec */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, #26C5FF 0%, #CA43FF 52%, #FF419F 100%)",
          width: "100%",
        }}
      />

      {/* Door columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        {DOORS.map((door, i) => (
          <a
            key={door.label}
            href={door.href}
            className="door-link"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "28px 32px",
              borderRight:
                i < DOORS.length - 1
                  ? "1px solid rgba(255,255,255,0.08)"
                  : undefined,
              textDecoration: "none",
              transition: "background-color 0.15s ease",
            }}
          >
            {/* Door label — Syne Title 24 */}
            <span
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: 24,
                fontWeight: 600,
                color: "#e8e8ea",
                lineHeight: 1.1,
                marginBottom: 8,
                display: "block",
              }}
            >
              {door.label}
            </span>

            {/* Sublabel — JetBrains Mono 12px muted per design skill update */}
            <span
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                color: "#6a6a70",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              {door.sub}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
