import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER_NAME = "gitflare-web-prod";

const sourceWrangler = JSON.parse(
  readFileSync(join(webRoot, "wrangler.jsonc"), "utf8")
);
const alchemyDir = join(webRoot, ".alchemy/local");
mkdirSync(alchemyDir, { recursive: true });
writeFileSync(
  join(alchemyDir, "wrangler.jsonc"),
  JSON.stringify(
    {
      ...sourceWrangler,
      main: "../../src/server.ts",
      assets: {
        ...sourceWrangler.assets,
        directory: "../../dist/client",
      },
    },
    null,
    2
  )
);

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

const existing = spawnSync(
  "npx",
  ["wrangler", "versions", "list", "--name", WORKER_NAME, "--json"],
  {
    cwd: webRoot,
    encoding: "utf8",
    env: process.env,
  }
);
const workerExists =
  existing.status === 0 &&
  !/not found|does not exist|hasn't been deployed/i.test(
    `${existing.stdout}\n${existing.stderr}`
  );

// First deploy must register Repo as a sqlite Durable Object.
// Re-applying new_sqlite_classes on later deploys fails with code 10074.
if (workerExists) {
  config.migrations = [];
} else if (!Array.isArray(config.migrations) || config.migrations.length === 0) {
  config.migrations = [{ tag: "v1", new_sqlite_classes: ["Repo"] }];
}
writeFileSync(wranglerPath, JSON.stringify(config));

const result = spawnSync(
  "npx",
  ["wrangler", "deploy", "--name", WORKER_NAME],
  {
    cwd: webRoot,
    stdio: "inherit",
    env: process.env,
  }
);

process.exit(result.status ?? 1);
