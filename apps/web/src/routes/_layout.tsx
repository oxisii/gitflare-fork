import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { GitBranchIcon } from "lucide-react";
import { ErrorComponent } from "@/components/error-component";
import { UserProfileButton } from "@/components/user-profile-button";
import { LanguageToggle, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const t = useT();
  return (
    <>
      <div className="border-b py-3">
        <nav className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-3" to="/">
              <GitBranchIcon className="size-5" />
              <span className="font-semibold text-lg">{t("app.name")}</span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <UserProfileButton />
            </div>
          </div>
        </nav>
      </div>
      <section className="mx-auto max-w-5xl px-4">
        <Outlet />
      </section>
    </>
  );
}
