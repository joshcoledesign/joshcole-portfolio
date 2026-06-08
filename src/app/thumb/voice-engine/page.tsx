// Standalone capture route for the Brand Voice Engine pipeline diagram.
// View at /thumb/voice-engine — unlinked.

import { BrandVoiceEngine } from "@/components/diagrams/brand-voice-engine";

export default function VoiceEngineThumb() {
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
        <BrandVoiceEngine />
      </div>
    </div>
  );
}
