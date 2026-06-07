// Standalone capture route for the RFP Agent workflow diagram.
// View at /thumb/rfp-agent-workflow — unlinked.

import { RfpAgentWorkflow } from "@/components/diagrams/rfp-agent-workflow";

export default function RfpAgentWorkflowThumb() {
  return (
    <div
      style={{
        background: "#101117",
        display: "flex",
        justifyContent: "center",
        padding: "40px 0",
      }}
    >
      <div style={{ width: 960, maxWidth: "100%" }}>
        <RfpAgentWorkflow />
      </div>
    </div>
  );
}
