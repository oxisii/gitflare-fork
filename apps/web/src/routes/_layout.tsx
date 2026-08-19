import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { GitBranchIcon } from "lucide-react";
import { ErrorComponent } from "@/components/error-component";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserProfileButton } from "@/components/user-profile-button";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="border-b py-3">
        <nav className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between gap-2">
            <Link className="flex min-w-0 items-center gap-2 sm:gap-3" to="/">
              <GitBranchIcon className="size-5 shrink-0" />
              <span className="truncate font-semibold text-base sm:text-lg">
                {m.app_name()}
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <LanguageSwitcher className="w-[88px] sm:w-[110px]" />
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
