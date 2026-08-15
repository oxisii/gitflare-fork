import { createFileRoute } from "@tanstack/react-router";
import { NotFoundComponent } from "@/components/404-components";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/$owner/$repo/_layout/pulls")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  const t = useT();
  return <div className="text-center text-xl">{t("pulls.todo")}</div>;
}
