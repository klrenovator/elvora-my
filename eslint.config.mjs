import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      },
    },
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    // TypeScript checks these more accurately, including type-only imports.
    rules: { "no-undef": "off", "no-unused-vars": "off" },
  },
]);
