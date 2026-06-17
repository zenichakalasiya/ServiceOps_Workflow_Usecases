import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// base is "/" for local dev; on GitHub Pages the site is served under /<repo>/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/ServiceOps_Workflow_Usecases/" : "/",
  // host:true exposes the dev server on your LAN; allowedHosts lets public tunnels through
  server: { port: 5173, open: true, host: true, allowedHosts: true },
  // build both pages: the main app + the standalone conflict-timing demo
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "conflict-timing": resolve(__dirname, "conflict-timing.html"),
      },
    },
  },
}));
