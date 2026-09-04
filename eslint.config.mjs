import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The site deliberately ships plain <img> everywhere: images are local,
      // pre-optimized webp variants (640/1920) served through EditorialImage
      // or directly, so next/image's optimization pipeline adds nothing here.
      "@next/next/no-img-element": "off",
      // Allow intentionally-unused args named with a leading underscore
      // (e.g. vitest.setup.ts's matchMedia _callback).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Locked, verbatim-integrated components (animated-shader-hero,
  // blackhole-hero-section, stagger-testimonials) arrived with their own
  // code style; lint them for real problems only, not stylistic TS rules
  // that would churn files we committed to keeping as supplied.
  {
    files: [
      "components/ui/animated-shader-hero.tsx",
      "components/ui/blackhole-hero-section.tsx",
      "components/ui/stagger-testimonials.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
