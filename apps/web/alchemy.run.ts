import alchemy from "alchemy";
import {
  D1Database,
  DurableObjectNamespace,
  TanStackStart,
} from "alchemy/cloudflare";
import { CloudflareStateStore } from "alchemy/state";

const PROD_DOMAIN = "git.outtw.com";

const LOCAL_URL = "http://localhost:3000";
const PROD_URL = `https://${PROD_DOMAIN}`;

const app = await alchemy("gitflare", {
  password: process.env.ALCHEMY_PASSWORD,
  stateStore: (scope) => new CloudflareStateStore(scope, { forceUpdate: true }),
});

const repoDO = DurableObjectNamespace("repos", {
  className: "Repo",
  sqlite: true,
});

const db = await D1Database("gitflare-db", {
  name: "gitflare-db",
  migrationsDir: "./migrations",
});

const isProd = app.stage === "prod";

function getCurrentUrl() {
  if (isProd) {
    return PROD_URL;
  }
  return LOCAL_URL;
}

export const web = await TanStackStart("web", {
  adopt: true,
  bindings: {
    REPO: repoDO,
    DB: db,
    LOG_LEVEL: isProd ? "warn" : "debug",
    SITE_URL: getCurrentUrl(),
    VITE_BETTER_AUTH_URL: getCurrentUrl(),
    BETTER_AUTH_SECRET: alchemy.env.BETTER_AUTH_SECRET,
  },
});

await app.finalize();
