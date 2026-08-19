import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import "./index.css";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as m from "./paraglide/messages";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
    defaultPreload: "intent",
    scrollRestoration(opts) {
      const pathname = opts.location.pathname;

      // Disable scroll restoration for commit viewer pages
      if (/^\/[^/]+\/[^/]+\/commits\/[0-9a-f]{7,40}$/i.test(pathname)) {
        return false;
      }

      return true;
    },
    defaultPendingComponent: () => <Loader />,
    defaultNotFoundComponent: () => <div>{m.common_not_found()}</div>,
    context: { queryClient },
  });

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  });

  return router;
}

declare module "@tanstack/react-router" {
  // biome-ignore lint/style/useConsistentTypeDefinitions: it is what it is
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
