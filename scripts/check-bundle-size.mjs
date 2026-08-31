import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const assetsDirectory = fileURLToPath(new URL("../dist-vercel/assets/", import.meta.url));
const limits = { ".js": 100 * 1024, ".css": 25 * 1024 };
const totals = { ".js": 0, ".css": 0 };

for (const file of readdirSync(assetsDirectory)) {
  const extension = extname(file);
  if (!(extension in totals)) continue;
  totals[extension] += gzipSync(readFileSync(join(assetsDirectory, file))).byteLength;
}

for (const [extension, total] of Object.entries(totals)) {
  const limit = limits[extension];
  const label = extension === ".js" ? "JavaScript" : "CSS";
  console.log(`${label}: ${(total / 1024).toFixed(1)} KB gzip (limit ${(limit / 1024).toFixed(0)} KB)`);
  if (total > limit) process.exitCode = 1;
}
