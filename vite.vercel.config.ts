import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { generateSeoPages } from "./scripts/prerender-seo";
import { cleanRoutePaths } from "./site-registry";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = `${projectRoot}/dist-vercel`;
const cleanRoutes = new Set(cleanRoutePaths);

export default defineConfig({
  appType: "mpa",
  publicDir: `${projectRoot}/public`,
  plugins: [
    react(),
    {
      name: "andrian-seo-prerender",
      apply: "build",
      async closeBundle() {
        await generateSeoPages(outDir);
      },
    },
    {
      name: "andrian-clean-url-preview",
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          if (!request.url) return next();
          const url = new URL(request.url, "http://127.0.0.1");
          const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
          if (cleanRoutes.has(pathname)) request.url = `${pathname}.html${url.search}`;
          next();
        });
      },
    },
  ],
  build: {
    outDir,
    emptyOutDir: true,
  },
});
