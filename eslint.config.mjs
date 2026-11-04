import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/portfolio/**",
    "public/experiments/dry-run-dungeon/runtime/**",
    "src/portfolio/runtime/**",
    "src/worldstage/source/**",
    "public/experiments/worldstage/studio/painter.js",
    "public/experiments/worldstage/studio/mediabunny.mjs",
    ...["studio.js","shot-editor.js","motion-preview.js","cue-track.js","performance-audio.js","sound-preview.js","shot-plan.js","thruster-rig.js","edit-history.js","exhaust-ground.js","coverage-projection.js","terrain-ground.js","studio-config.js"].map(name => `public/experiments/worldstage/studio/${name}`),
    "src/portfolio/navigation.js",
  ]),
]);

export default eslintConfig;
