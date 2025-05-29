/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
});
