import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const apiTarget = "http://localhost:8060";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": apiTarget,
      "/memo": apiTarget,
      "/plugin": apiTarget,
      "/user": apiTarget,
      "/upload": apiTarget,
      "/deleteMyAccount": apiTarget,
      "/csvExport": apiTarget,
      "/health": apiTarget,
    },
  },
  build: {
    outDir: "../api/web/public",
    emptyOutDir: true,
  },
});
