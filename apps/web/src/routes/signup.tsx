import { createFileRoute } from "@tanstack/react-router";
import { GitBranchIcon } from "lucide-react";
import { NotFoundComponent } from "@/components/404-components";
import SignUpForm from "@/components/sign-up-form";
import { LanguageToggle, useT } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  const t = useT();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <GitBranchIcon />
          {t("app.name")}
        </a>
      </div>
      <SignUpForm />
      <LanguageToggle />
    </div>
  );
}
