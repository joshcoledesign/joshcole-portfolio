// Vertical process-flow diagram for UST RFP Triage Agent case study.
// Three phases mapped to the brand gradient:
//   Ingestion (cyan) → Scoring & output (violet) → Verdict & delivery (pink)

export function RfpAgentWorkflow() {
  // ── Layout ──
  const W = 960;
  const H = 1400;
  const NW = 340; // main node width
  const NX = (W - NW) / 2; // 310
  const CX = W / 2; // 480
  const TX = NX + 18; // text x inside nodes

  // ── Tokens ──
  const CYAN = "#26C5FF";
  const VIOLET = "#CA43FF";
  const PINK = "#FF419F";
  const FILL = "#15161c";
  const BG = "#101117";
  const BRIGHT = "#e8e8ea";
  const MUTED = "#acacb1";
  const DIM = "#6a6a70";
  const MONO = "var(--font-jetbrains-mono), monospace";
  const BODY = "var(--font-inter), system-ui, sans-serif";

  // ── Main flow nodes ──
  // y/h pre-computed; gap between step 3→4 is wider for the branch.
  const nodes = [
    { y: 40, h: 70, title: "Incoming requests", sub: ["Request systems, scraping, direct email"], color: CYAN },
    { y: 160, h: 70, title: "Power Automate ingestion", sub: ["Email simplified to a text file"], color: CYAN },
    { y: 280, h: 70, title: "Is the full request present?", sub: ["Scrape the rest if the email is partial"], color: CYAN },
    { y: 458, h: 70, title: "CoPilot reads the full request", sub: ["Complete RFP, ready to score"], color: VIOLET },
    { y: 578, h: 86, title: "Score against the rules table", sub: ["Team-owned, editable rubric. A hard-no", "rule kills the request immediately"], color: VIOLET },
    { y: 714, h: 70, title: "Per-request spreadsheet", sub: ["Every rule scored, then stored"], color: VIOLET },
    { y: 834, h: 86, title: "Summary document", sub: ["Synopsis, results, final score, flags,", "and a link to the stored spreadsheet"], color: VIOLET },
    { y: 970, h: 70, title: "Go / Maybe / No-go verdict", sub: ["Triage score with flags on why"], color: PINK },
    { y: 1090, h: 70, title: "Delivered to Teams", sub: ["The team's morning review surface"], color: PINK },
    { y: 1210, h: 86, title: "Human decision", sub: ["3\u20135 of ~20 daily requests get scrubbed", "by people and pursued"], color: PINK },
  ];

  // ── Side blocks ──
  const hf = { x: 40, y: 361, w: 200, h: 74 }; // human fetch (left) — centered between connectors at 350 and 445
  const step3CY = 280 + 70; // 350 — bottom of step 3
  const mergeY = 445; // Y-merge junction: complete path + return path converge here before CoPilot

  const step5CY = 578 + 43; // 621 — center-y of step 5
  const rt = { x: 720, y: step5CY - 28, w: 200, h: 56 }; // rules table (right)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="UST RFP Triage Agent workflow: intake, scoring, triage, and delivery"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <pattern
          id="wf-grid"
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
      </defs>

      {/* Background + grid */}
      <rect width={W} height={H} fill={BG} />
      <rect width={W} height={H} fill="url(#wf-grid)" />

      {/* ── Main vertical connectors ── */}
      {nodes.map((node, i) => {
        if (i >= nodes.length - 1) return null;
        if (i === 2) return null; // drawn as split segments around the merge circle below
        const next = nodes[i + 1];
        return (
          <line
            key={`c${i}`}
            x1={CX}
            y1={node.y + node.h}
            x2={CX}
            y2={next.y}
            stroke={node.color}
            strokeWidth={1}
          />
        );
      })}

      {/* ── Split 2→3 connector: "complete" input + merged output, separated by merge circle ── */}
      <line x1={CX} y1={nodes[2].y + nodes[2].h} x2={CX} y2={mergeY - 2.5} stroke={CYAN} strokeWidth={1} />
      <line x1={CX} y1={mergeY + 2.5} x2={CX} y2={nodes[3].y} stroke={CYAN} strokeWidth={1} />

      {/* ── Branch: "blocked" from step 3 left → human fetch top ── */}
      <path
        d={`M ${NX},${step3CY} H ${hf.x + hf.w / 2} V ${hf.y}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1}
      />
      <text
        x={Math.round((NX + hf.x + hf.w / 2) / 2)}
        y={step3CY - 8}
        fontFamily={MONO}
        fontSize={10}
        fill={DIM}
        textAnchor="middle"
      >
        blocked
      </text>

      {/* ── Return: human fetch bottom → merge with main flow ── */}
      <path
        d={`M ${hf.x + hf.w / 2},${hf.y + hf.h} V ${mergeY} H ${CX}`}
        fill="none"
        stroke={CYAN}
        strokeWidth={1}
      />
      <circle cx={CX} cy={mergeY} r={2.5} fill={CYAN} />

      {/* "complete" label on main path */}
      <text
        x={CX + 4}
        y={Math.round((step3CY + mergeY) / 2) + 4}
        fontFamily={MONO}
        fontSize={10}
        fill={DIM}
      >
        complete
      </text>

      {/* ── Rules table connector (dashed) ── */}
      <line
        x1={NX + NW}
        y1={step5CY}
        x2={rt.x}
        y2={step5CY}
        stroke={VIOLET}
        strokeWidth={1}
        strokeDasharray="4 4"
      />

      {/* ── Side block: Human fetch (left, solid border) ── */}
      <rect
        x={hf.x}
        y={hf.y}
        width={hf.w}
        height={hf.h}
        fill={FILL}
        stroke={CYAN}
        strokeWidth={1}
      />
      <text x={hf.x + 14} y={hf.y + 24} fontFamily={MONO} fontSize={11} fill={BRIGHT}>
        Human fetch
      </text>
      <text x={hf.x + 14} y={hf.y + 42} fontFamily={BODY} fontSize={11} fill={MUTED}>
        Person logs in, copies or
      </text>
      <text x={hf.x + 14} y={hf.y + 56} fontFamily={BODY} fontSize={11} fill={MUTED}>
        downloads the RFP
      </text>

      {/* ── Side block: Rules table (right, dashed border) ── */}
      <rect
        x={rt.x}
        y={rt.y}
        width={rt.w}
        height={rt.h}
        fill={FILL}
        stroke={VIOLET}
        strokeWidth={1}
        strokeDasharray="6 4"
      />
      <text x={rt.x + 14} y={rt.y + 22} fontFamily={MONO} fontSize={11} fill={BRIGHT}>
        Rules table
      </text>
      <text x={rt.x + 14} y={rt.y + 40} fontFamily={BODY} fontSize={11} fill={MUTED}>
        Maintained by team
      </text>

      {/* ── Main flow nodes ── */}
      {nodes.map((node, i) => (
        <g key={`n${i}`}>
          <rect
            x={NX}
            y={node.y}
            width={NW}
            height={node.h}
            fill={FILL}
            stroke={node.color}
            strokeWidth={1}
          />
          <text x={TX} y={node.y + 28} fontFamily={MONO} fontSize={13} fill={BRIGHT}>
            {node.title}
          </text>
          {node.sub.map((line, j) => (
            <text
              key={j}
              x={TX}
              y={node.y + 48 + j * 16}
              fontFamily={BODY}
              fontSize={12}
              fill={MUTED}
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* ── Legend ── */}
      <g>
        <rect x={198} y={1350} width={12} height={12} fill={CYAN} />
        <text x={218} y={1361} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Ingestion
        </text>

        <rect x={301} y={1350} width={12} height={12} fill={VIOLET} />
        <text x={321} y={1361} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Automated scoring and output
        </text>

        <rect x={547} y={1350} width={12} height={12} fill={PINK} />
        <text x={567} y={1361} fontFamily={BODY} fontSize={12} fill={MUTED}>
          Verdict, delivery, and human path
        </text>
      </g>
    </svg>
  );
}
