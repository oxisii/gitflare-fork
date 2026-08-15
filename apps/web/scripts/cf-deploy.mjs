import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const build = spawnSync("pnpm", ["build"], {
  cwd: webRoot,
  stdio: "inherit",
  env: process.env,
});
if (build.status) {
  process.exit(build.status);
}

const wranglerPath = join(webRoot, "dist/server/wrangler.json");

const config = JSON.parse(readFileSync(wranglerPath, "utf8"));
// Repo Durable Object already exists on gitflare-web-prod.
// Re-applying new_sqlite_classes fails the deploy.
config.migrations = [];
writeFileSync(wranglerPath, JSON.stringify(config));

const result = spawnSync(
  "npx",
  ["wrangler", "deploy", "--name", "gitflare-web-prod"],
  {
    cwd: webRoot,
    stdio: "inherit",
    env: process.env,
  }
);

process.exit(result.status ?? 1);
