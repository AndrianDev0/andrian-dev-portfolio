import vinext from "vinext";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= `${projectRoot}/.wrangler/logs`;
  process.env.MINIFLARE_REGISTRY_PATH ??= `${projectRoot}/.wrangler/registry`;
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    publicDir: `${projectRoot}/public`,
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: {
          main: "./worker.ts",
          compatibility_flags: ["nodejs_compat"],
          d1_databases: [],
          r2_buckets: [],
        },
      }),
    ],
  };
});
