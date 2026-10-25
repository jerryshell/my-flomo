import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const apiTarget = "http://localhost:8060";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/auth": apiTarget,
      "/memo": apiTarget,
      "/plugin": apiTarget,
      "/user": apiTarget,
      "/upload": apiTarget,
      "/deleteMyAccount": apiTarget,
      "/csvExport": apiTarget,
      "/csvImport": apiTarget,
      "/health": apiTarget,
    },
  },
  build: {
    outDir: "../api/web/public",
    emptyOutDir: true,
  },
});
