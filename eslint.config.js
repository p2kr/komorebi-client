import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";

export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  ...(Array.isArray(tailwind.configs?.["flat/recommended"])
    ? tailwind.configs["flat/recommended"]
    : tailwind.configs?.["flat/recommended"]
      ? [tailwind.configs["flat/recommended"]]
      : []),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.svelte.ts"],
    languageOptions: {
      parser: ts.parser,
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ["build/", "dist/", ".svelte-kit/", "node_modules/", ".yarn/"],
  },
]);
