import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionOptions } from "@/api/session";
import { NotFoundComponent } from "@/components/404-components";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_layout/dashboard")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  loader: async ({ context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(getSessionOptions);
    if (!data) {
      throw redirect({ to: "/" });
    }
    return data;
  },
});

function RouteComponent() {
  const { data: session } = useSuspenseQuery(getSessionOptions);
  const user = session?.user;
  const username = user?.username ?? "";
  const t = useT();

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {t("dashboard.welcome", { username })}
      </div>
    </div>
  );
}
