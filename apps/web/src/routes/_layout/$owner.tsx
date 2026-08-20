import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GitBranchIcon, LockIcon } from "lucide-react";
import { getReposByOwnerOpts } from "@/api/repos";
import { getSessionOptions } from "@/api/session";
import { NotFoundComponent } from "@/components/404-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { avatarSrc } from "@/lib/avatar";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/_layout/$owner")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      getReposByOwnerOpts({ owner: params.owner })
    );
  },
});

function RouteComponent() {
  const { owner } = Route.useParams();
  const { data: repositories } = useSuspenseQuery(
    getReposByOwnerOpts({ owner })
  );
  const { data: session } = useQuery(getSessionOptions);
  const image =
    session?.user?.username === owner ? session.user.image : undefined;

  return (
    <div className="py-8">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="col-span-1">
          <Avatar className="mb-4 size-48 rounded-full">
            <AvatarImage alt={`@${owner}`} src={avatarSrc(image)} />
            <AvatarFallback>
              {owner
                .split(" ")
                .map((w) => w.at(0))
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-2xl">{owner}</h2>
            <p className="text-muted-foreground">{owner}</p>
          </div>
        </div>
        <div className="col-span-3">
          <h2 className="mb-4 font-semibold text-xl">
            {m.profile_repositories()}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {repositories.length === 0 ? (
              <p className="text-muted-foreground">{m.profile_no_repos()}</p>
            ) : (
              repositories.map((repo) => (
                <Link
                  className="h-full"
                  key={repo.id}
                  params={{ owner: repo.owner, repo: repo.name }}
                  to="/$owner/$repo"
                >
                  <Card className="h-full transition-colors hover:bg-accent">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <GitBranchIcon className="size-4 text-muted-foreground" />
                          <CardTitle>{repo.name}</CardTitle>
                        </div>
                        {repo.isPrivate && (
                          <LockIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      {repo.description && (
                        <CardDescription className="line-clamp-2 text-sm">
                          {repo.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
