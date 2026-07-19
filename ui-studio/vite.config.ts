import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, "../docs/10-ui-ux-architecture/mockups"),
  server: {
    port: 4173
  }
});
