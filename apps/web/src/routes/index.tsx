import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, GitBranchIcon } from "lucide-react";
import { NotFoundComponent } from "@/components/404-components";
import { GitHubIcon } from "@/components/github";
import { buttonVariants } from "@/components/ui/button";
import { UserProfileButton } from "@/components/user-profile-button";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  notFoundComponent: NotFoundComponent,
});

function HomeComponent() {
  const t = useT();
  return (
    <main className="mx-auto mb-30 max-w-11/12 border border-x md:max-w-6xl">
      <div className="sticky top-0 border-b bg-background">
        <nav className="mx-auto max-w-5xl p-4">
          <div className="flex items-center justify-between gap-2">
            <Link className="flex min-w-0 items-center gap-2 sm:gap-3" to="/">
              <GitBranchIcon className="size-5 shrink-0" />
              <span className="truncate font-semibold text-base sm:text-lg">
                {t("app.name")}
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <UserProfileButton />
            </div>
          </div>
        </nav>
      </div>
      <div className="border-b">
        <section className="mx-auto max-w-5xl space-y-6 px-4 py-20 sm:py-30">
          <div className="space-y-4">
            <h1 className="font-semibold text-2xl sm:text-4xl">
              {t("home.tagline")}
            </h1>
            <p className="max-w-2/3 text-muted-foreground text-sm leading-relaxed sm:text-base">
              {t("home.description")}
            </p>
          </div>
          <div className="flex gap-3">
            <Link className={buttonVariants()} to="/dashboard">
              {t("home.getStarted")}
              <ArrowRightIcon />
            </Link>
            <a
              className={buttonVariants({ variant: "outline" })}
              href="https://github.com/mdhruvil/gitflare"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitHubIcon />
              {t("home.github")}
            </a>
          </div>
          <div className="my-14">
            <div className="overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between border-b bg-card px-3 py-1.5">
                <span className="text-sm">bash</span>
              </div>

              <HeroCodeBlock />
            </div>
          </div>
        </section>
      </div>
      <div className="border-b">
        <section className="mx-auto my-10 max-w-5xl space-y-6 px-4 sm:my-20">
          <p className="text-xl">{t("home.featuresTitle")}</p>
          <h3 className="text-pretty text-lg text-muted-foreground">
            {t("home.description")}
          </h3>
          <div className="space-y-2 leading-relaxed">
            <FeatureRow
              description={t("home.featureServerlessDesc")}
              feature={t("home.featureServerless")}
            />
            <FeatureRow
              description={t("home.featureDurableDesc")}
              feature={t("home.featureDurable")}
            />
            <FeatureRow
              description={t("home.featureOpenSourceDesc")}
              feature={t("home.featureOpenSource")}
            />
            <FeatureRow
              description={t("home.featureFastDesc")}
              feature={t("home.featureFast")}
            />
          </div>
        </section>
      </div>

      <div className="border-b">
        <section className="mx-auto my-10 max-w-5xl space-y-6 px-4 sm:my-20">
          <p className="text-xl">{t("home.builtWith")}</p>

          <div className="space-y-2 leading-relaxed">
            <TechRow
              description={t("home.techWorkers")}
              href="https://developers.cloudflare.com/workers/"
              title="Cloudflare Workers"
            />
            <TechRow
              description={t("home.techDO")}
              href="https://developers.cloudflare.com/durable-objects/"
              title="Cloudflare Durable Objects"
            />
            <TechRow
              description={t("home.techD1")}
              href="https://developers.cloudflare.com/d1/"
              title="Cloudflare D1"
            />
            <TechRow
              description={t("home.techAuth")}
              href="https://www.better-auth.com/"
              title="Better Auth"
            />
            <TechRow
              description={t("home.techTanstack")}
              href="https://tanstack.com/start/latest"
              title="Tanstack Start"
            />
          </div>
        </section>
      </div>

      <section className="mx-auto items-center max-sm:divide-y sm:flex sm:divide-x">
        <a
          className="flex h-30 w-full grow items-center justify-center gap-3 text-lg underline-offset-8 hover:bg-accent hover:underline"
          href="https://github.com/mdhruvil/gitflare"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("home.giveStar")} <GitHubIcon className="size-5" />
        </a>
        <Link
          className="flex h-30 w-full grow items-center justify-center gap-3 text-lg underline-offset-8 hover:bg-accent hover:underline"
          to="/dashboard"
        >
          {t("home.getStarted")} <ArrowRightIcon className="size-5" />
        </Link>
      </section>
    </main>
  );
}

function FeatureRow({
  feature,
  description,
}: {
  feature: string;
  description: string;
}) {
  return (
    <div>
      <span className="font-mono text-muted-foreground"> - [x] </span>
      <span className="font-semibold">{feature}</span> -{" "}
      <span className="text-muted-foreground">{description}</span>
    </div>
  );
}

function TechRow({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div>
      <span className="font-mono text-muted-foreground"> - [x] </span>
      <a
        className="font-semibold underline underline-offset-6"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {title}
      </a>{" "}
      - <span className="text-muted-foreground">{description}</span>
    </div>
  );
}

function HeroCodeBlock() {
  return (
    <div className="shiki-wrapper text-sm leading-relaxed">
      <pre
        className="shiki github-dark-default overflow-x-auto bg-transparent p-4"
        style={{ color: "#e6edf3" }}
      >
        <code>
          <span className="line" data-line={1}>
            <span style={{ color: "#FFA657" }}>git</span>
            <span style={{ color: "#A5D6FF" }}> remote</span>
            <span style={{ color: "#A5D6FF" }}> add</span>
            <span style={{ color: "#A5D6FF" }}> origin</span>
            <span style={{ color: "#A5D6FF" }}>
              {" "}
              https://gitflare.mdhruvil.com/username/repo.git
            </span>
            <span style={{ color: "#E6EDF3" }}> </span>
          </span>
          {"\n"}
          <span className="line" data-line={2}>
            <span style={{ color: "#FFA657" }}>git</span>
            <span style={{ color: "#A5D6FF" }}> branch</span>
            <span style={{ color: "#79C0FF" }}> -M</span>
            <span style={{ color: "#A5D6FF" }}> main</span>
          </span>
          {"\n"}
          <span className="line" data-line={3}>
            <span style={{ color: "#FFA657" }}>git</span>
            <span style={{ color: "#A5D6FF" }}> push</span>
            <span style={{ color: "#79C0FF" }}> -u</span>
            <span style={{ color: "#A5D6FF" }}> origin</span>
            <span style={{ color: "#A5D6FF" }}> main</span>
          </span>
          {"\n"}
          <span data-line={4} />
        </code>
      </pre>
    </div>
  );
}
