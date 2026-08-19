import { createFileRoute } from "@tanstack/react-router";
import { GitBranchIcon } from "lucide-react";
import { NotFoundComponent } from "@/components/404-components";
import { LanguageSwitcher } from "@/components/language-switcher";
import SignUpForm from "@/components/sign-up-form";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <GitBranchIcon />
          {m.app_name()}
        </a>
      </div>
      <SignUpForm />
      <LanguageSwitcher />
    </div>
  );
}
