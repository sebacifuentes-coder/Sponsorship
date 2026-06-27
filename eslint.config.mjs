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
    // Artefactos de planificación y tooling BMAD — no son código de la app.
    "_bmad/**",
    "_bmad-output/**",
    "design-artifacts/**",
    "docs/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
