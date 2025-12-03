import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // @ts-expect-error - Vite plugin type mismatch with vitest/config
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": "http://api:8080",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
