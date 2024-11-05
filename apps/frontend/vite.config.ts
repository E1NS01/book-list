import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  plugins: [react()] as UserConfig["plugins"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 1234,
  },
  preview: {
    host: "0.0.0.0",
    port: 1234,
  },
});
