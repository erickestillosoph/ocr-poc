import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// const API_URL_NETWORK =
//   process.env.VITE_API_URL_NETWORK || "https://8ead45c93317d7.lhr.life";
// const API_URL_LOCAL = process.env.VITE_API_URL_LOCAL || "";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [".lhr.life", "localhost", "*"],
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Access-Control-Allow-Origin",
        "Accept",
      ],
      credentials: false,
    },
  },
  base: "/",
  build: {
    outDir: "./dist",
    rollupOptions: {
      output: {
        format: "es",
        manualChunks: {
          vendor: [
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
          ],
        },
      },
    },
    assetsDir: "assets",
    emptyOutDir: true,
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
      "@/providers": resolve(__dirname, "src/providers"),
    },
  },
});
