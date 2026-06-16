import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  // build both pages: the main app + the standalone conflict-timing demo
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "conflict-timing": resolve(__dirname, "conflict-timing.html"),
      },
    },
  },
});
