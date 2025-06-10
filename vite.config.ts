import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
        {
          src: "node_modules/jieba-wasm/pkg/web/jieba_rs_wasm_bg.wasm",
          dest: "/node_modules/.vite/deps",
        },
      ],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true, // Targets modern browsers that can handle top-level-await features
    },
  },
});
