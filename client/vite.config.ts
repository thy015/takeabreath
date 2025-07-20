import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig({
  base: "/",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    open: true,
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
