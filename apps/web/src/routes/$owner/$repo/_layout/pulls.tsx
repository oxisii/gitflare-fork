import { createFileRoute } from "@tanstack/react-router";
import { NotFoundComponent } from "@/components/404-components";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/$owner/$repo/_layout/pulls")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  return <div className="text-center text-xl">{m.pulls_todo()}</div>;
}
