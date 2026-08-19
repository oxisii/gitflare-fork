import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckIcon, CopyIcon, FileIcon, GitCommitIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { getCommitQueryOptions } from "@/api/commits";
import { NotFoundComponent } from "@/components/404-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { diffOptionsWithHeader, diffsStyleVariables } from "@/lib/diffs-config";
import { formatDate } from "@/lib/i18n-format";
import * as m from "@/paraglide/messages";

const LazyMultiFileDiff = lazy(() =>
  import("@pierre/diffs/react").then((m) => ({ default: m.MultiFileDiff }))
);

export const Route = createFileRoute(
  "/$owner/$repo/_layout/commits_/$commitId"
)({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const { owner, repo, commitId } = params;
    await queryClient.ensureQueryData(
      getCommitQueryOptions({
        owner,
        repo,
        commitOid: commitId,
      })
    );
  },
});

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button className="size-7" onClick={handleCopy} size="icon" variant="ghost">
      {copied ? (
        <CheckIcon className="size-3" />
      ) : (
        <CopyIcon className="size-3" />
      )}
    </Button>
  );
}

function RouteComponent() {
  const params = Route.useParams();
  const { owner, repo, commitId } = params;

  const { data } = useSuspenseQuery(
    getCommitQueryOptions({
      owner,
      repo,
      commitOid: commitId,
    })
  );

  const commit = data.commit?.commit;
  const changes = data.changes;

  if (!commit) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <GitCommitIcon className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 font-semibold text-lg">{m.commit_not_found()}</h3>
          <p className="text-muted-foreground text-sm">
            {m.commit_not_found_desc()}
          </p>
        </div>
      </div>
    );
  }

  const shortHash = commitId.substring(0, 7);
  const fullHash = commitId;
  const messageLines = commit.message.split("\n");
  const title = messageLines[0];
  const description = messageLines.slice(1).join("\n").trim();

  // Calculate stats
  const stats = changes.reduce(
    (acc, change) => {
      if (change.type === "add") {
        acc.filesAdded += 1;
      } else if (change.type === "remove") {
        acc.filesDeleted += 1;
      } else if (change.type === "modify") {
        acc.filesModified += 1;
      }
      return acc;
    },
    { filesAdded: 0, filesDeleted: 0, filesModified: 0 }
  );

  const totalFilesChanged =
    stats.filesAdded + stats.filesDeleted + stats.filesModified;

  return (
    <div className="space-y-6">
      {/* Commit Header Card */}
      <Card>
        <CardContent className="space-y-4">
          {/* Author Info */}
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {commit.author.name}
                </span>
                {commit.author.email && (
                  <span className="font-mono text-muted-foreground text-xs">
                    &lt;{commit.author.email}&gt;
                  </span>
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                {m.commit_authored()}{" "}
                {formatDate(
                  new Date(commit.author.timestamp * 1000),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              </div>
            </div>
            <div className="flex gap-5 text-xs">
              {commit.parent && commit.parent.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {m.commit_parent()}
                  </span>
                  <Link
                    className="rounded bg-muted px-2 py-0.5 font-mono transition-colors hover:bg-muted/80"
                    params={{ owner, repo, commitId: commit.parent[0] }}
                    to="/$owner/$repo/commits/$commitId"
                  >
                    {commit.parent[0].substring(0, 7)}
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {m.commit_commit()}
                </span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono">
                  {shortHash}
                </code>
                <CopyButton text={fullHash} />
              </div>
            </div>
          </div>

          {/* Commit Title */}
          <div>
            <h1 className="font-semibold text-lg">{title}</h1>
            {description && (
              <pre className="mt-3 whitespace-pre-wrap font-sans text-muted-foreground text-sm">
                {description}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Changes Summary */}
      <div className="flex items-center gap-3 font-mono text-sm">
        <span className="font-semibold">
          {totalFilesChanged === 1
            ? `1 ${m.commit_file()} ${m.commit_changed()}`
            : `${totalFilesChanged} ${m.commit_files()} ${m.commit_changed()}`}
        </span>
        {stats.filesAdded > 0 && (
          <span className="text-green-500">
            +{stats.filesAdded} {m.commit_added()}
          </span>
        )}
        {stats.filesModified > 0 && (
          <span className="text-yellow-500">
            ~{stats.filesModified} {m.commit_modified()}
          </span>
        )}
        {stats.filesDeleted > 0 && (
          <span className="text-red-500">
            -{stats.filesDeleted} {m.commit_deleted()}
          </span>
        )}
      </div>

      {/* File Changes */}
      <div className="space-y-6">
        {changes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileIcon className="mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">
                {m.commit_no_changes()}
              </h3>
              <p className="text-muted-foreground text-sm">
                {m.commit_no_changes_desc()}
              </p>
            </CardContent>
          </Card>
        )}

        {changes.map((change) => {
          const isBinary =
            (change.old?.isBinary ?? false) || (change.new?.isBinary ?? false);

          if (isBinary) {
            return (
              <div
                className="overflow-hidden rounded-lg border"
                key={change.path}
              >
                <div className="flex items-center border-b bg-muted/50 px-4 py-3">
                  <span className="font-mono text-sm">{change.path}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted/30 px-4 py-12 text-center">
                  <FileIcon className="mb-3 size-10 text-muted-foreground" />
                  <p className="font-medium text-sm">
                    {m.commit_binary_file()}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {m.commit_binary_file_desc()}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              className="overflow-hidden rounded-lg"
              key={change.path}
              style={diffsStyleVariables}
            >
              <Suspense
                fallback={
                  <div className="p-4 text-muted-foreground text-sm">
                    {m.commit_loading_diff()}
                  </div>
                }
              >
                <LazyMultiFileDiff
                  newFile={{
                    name: change.path,
                    contents: change.new?.content ?? "",
                  }}
                  oldFile={{
                    name: change.path,
                    contents: change.old?.content ?? "",
                  }}
                  options={diffOptionsWithHeader}
                />
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
}
