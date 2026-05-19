import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tailwindcss(),
    metaImagesPlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,

    // ✅ Разбиваем 919KB бандл на маленькие части
    rollupOptions: {
      output: {
        manualChunks: {
          // React ядро
          "vendor-react": ["react", "react-dom"],

          // UI библиотека Radix
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-scroll-area",
          ],

          // Анимации (тяжёлая)
          "vendor-framer": ["framer-motion"],

          // Графики
          "vendor-charts": ["recharts"],

          // Иконки
          "vendor-icons": ["lucide-react"],

          // Работа с данными
          "vendor-query": ["@tanstack/react-query"],

          // Формы
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],

          // Утилиты
          "vendor-utils": [
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
            "date-fns",
          ],
        },
      },
    },

    // ✅ Сжатие и оптимизация
    minify: "esbuild",
    target: "es2020",
    chunkSizeWarningLimit: 500,

    // ✅ Оптимизация CSS
    cssMinify: true,

    // ✅ Убираем sourcemaps в проде (уменьшает размер)
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
