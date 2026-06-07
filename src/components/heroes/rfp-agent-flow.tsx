// Abstract decision-flow graphic for UST RFP Triage Agent case study.
// Intake -> decision -> three-way triage (go / hold / reject).

export function RfpAgentFlow({ cover }: { cover?: boolean } = {}) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio={cover ? "xMidYMid slice" : undefined}
      role="img"
      aria-label="Abstract decision-flow diagram: intake nodes converge into a central scoring node, then branch into three triage outcomes"
      style={{
        width: "100%",
        height: cover ? "100%" : "auto",
        display: "block",
      }}
    >
      <defs>
        {/* 32 px grid — matches site */}
        <pattern
          id="hero-grid"
          width={32}
          height={32}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 32 0 H 0 V 32"
            fill="none"
            stroke="rgba(255,255,255,0.028)"
            strokeWidth={0.5}
          />
        </pattern>

        {/* Cyan glow for decision node */}
        <filter
          id="hero-glow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="12"
            result="blur"
          />
          <feFlood
            floodColor="#26C5FF"
            floodOpacity="0.45"
            result="color"
          />
          <feComposite
            in="color"
            in2="blur"
            operator="in"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background + grid */}
      <rect width={1600} height={900} fill="#101117" />
      <rect width={1600} height={900} fill="url(#hero-grid)" />

      {/* ── Connectors (behind nodes) ── */}
      <g fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1}>
        {/* Intake → Decision (entry at upper / mid / lower thirds) */}
        <path d="M 232,280 H 490 V 418 H 760" />
        <path d="M 252,450 H 760" />
        <path d="M 232,620 H 510 V 482 H 760" />

        {/* Decision → Outcomes (exit at upper / mid / lower thirds) */}
        <path d="M 840,418 H 1100 V 280 H 1336" />
        <path d="M 840,450 H 1336" />
        <path d="M 840,482 H 1100 V 620 H 1336" />
      </g>

      {/* ── Intake nodes (32 × 32) ── */}
      <g fill="#15161c" stroke="rgba(255,255,255,0.35)" strokeWidth={1}>
        <rect x={200} y={264} width={32} height={32} />
        <rect x={220} y={434} width={32} height={32} />
        <rect x={200} y={604} width={32} height={32} />
      </g>

      {/* ── Decision node (80 × 80) ── */}
      {/* Accent ring */}
      <rect
        x={748}
        y={398}
        width={104}
        height={104}
        fill="none"
        stroke="rgba(38,197,255,0.12)"
        strokeWidth={0.5}
      />
      {/* Main node */}
      <rect
        x={760}
        y={410}
        width={80}
        height={80}
        fill="#15161c"
        stroke="#26C5FF"
        strokeWidth={1.5}
        filter="url(#hero-glow)"
      />
      {/* Inner indicator */}
      <rect
        x={790}
        y={440}
        width={20}
        height={20}
        fill="rgba(38,197,255,0.2)"
      />

      {/* ── Outcome nodes (48 × 48) ── */}

      {/* Go — cyan, bright */}
      <rect
        x={1336}
        y={256}
        width={48}
        height={48}
        fill="#15161c"
        stroke="#26C5FF"
        strokeWidth={1.5}
      />
      <rect
        x={1352}
        y={272}
        width={16}
        height={16}
        fill="rgba(38,197,255,0.3)"
      />

      {/* Hold — neutral gray */}
      <rect
        x={1336}
        y={426}
        width={48}
        height={48}
        fill="#15161c"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={1}
      />
      <rect
        x={1352}
        y={442}
        width={16}
        height={16}
        fill="rgba(255,255,255,0.1)"
      />

      {/* Reject — deep desaturated red, dim */}
      <rect
        x={1336}
        y={596}
        width={48}
        height={48}
        fill="#15161c"
        stroke="#994444"
        strokeWidth={1}
      />
      <rect
        x={1352}
        y={612}
        width={16}
        height={16}
        fill="rgba(153,68,68,0.25)"
      />
    </svg>
  );
}
