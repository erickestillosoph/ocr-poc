import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "./dist",
    rollupOptions: {
      output: {
        format: "es",
      },
      external: [
        "react",
        "react-dom",
        "@chakra-ui/react",
        "@emotion/react",
        "@emotion/styled",
        "axios",
        "react-dropzone",
        "react-error-boundary",
        "react-hook-form",
        "react-icons",
        "react-router-dom",
        "react-webcam",
        "zod",
        "jotai",
        "jotai-effect",
        "next-themes",
        "framer-motion",
        "tanstack-query",
        "tanstack-query-devtools",
      ],
    },
  },
  resolve: {
    alias: {
      "@/shared": resolve(__dirname, "src/shared"),
      "@/pages": resolve(__dirname, "src/pages"),
      "@/layout": resolve(__dirname, "src/layout"),
      "@/components": resolve(__dirname, "src/components"),
      "@/assets": resolve(__dirname, "src/assets"),
      "@/hooks": resolve(__dirname, "src/hooks"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/types": resolve(__dirname, "src/types"),
      "@/services": resolve(__dirname, "src/services"),
      "@/routes": resolve(__dirname, "src/routes"),
      "@/features": resolve(__dirname, "src/features"),
    },
  },
});
