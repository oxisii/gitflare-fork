import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    alchemy(),
    tanstackStart(),
    viteReact(),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
      emitTsDeclarations: true,
      routeStrategies: [
        { match: "/api/:path(.*)?", exclude: true },
        { match: "/:owner/:repo/info/refs", exclude: true },
        { match: "/:owner/:repo/git-upload-pack", exclude: true },
        { match: "/:owner/:repo/git-receive-pack", exclude: true },
      ],
    }),
  ],
  server: {
    port: 3000,
  },
});
