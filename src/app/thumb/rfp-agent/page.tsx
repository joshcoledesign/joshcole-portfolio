// Standalone thumbnail page for UST RFP Triage Agent case study.
// Unlinked — screen-capture at /thumb/rfp-agent, then remove or leave dormant.

import { RfpAgentFlow } from "@/components/heroes/rfp-agent-flow";

export default function RfpAgentThumb() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#101117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 1600 }}>
        <RfpAgentFlow />
      </div>
    </div>
  );
}
