import { Illustration, NotFound } from "@/components/ui/not-found";
import { useT } from "@/lib/i18n";

export function NotFoundComponent() {
  const t = useT();
  return (
    <div className="relative flex min-h-svh w-full flex-col justify-center bg-background p-6 md:p-10">
      <div className="relative mx-auto w-full max-w-5xl">
        <Illustration className="absolute inset-0 w-full text-foreground opacity-[0.04] dark:opacity-[0.03]" />
        <NotFound
          description={t("notFound.description")}
          title={t("notFound.title")}
        />
      </div>
    </div>
  );
}
