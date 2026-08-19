import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpenIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  TerminalIcon,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { z } from "zod";
import { getRepoByOwnerAndNameOpts } from "@/api/repos";
import { getBlobQueryOptions, getTreeQueryOptions } from "@/api/tree";
import { NotFoundComponent } from "@/components/404-components";
import { BranchSelector } from "@/components/branch-selector";
import { components } from "@/components/md-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative } from "@/lib/i18n-format";
import * as m from "@/paraglide/messages";

const searchSchema = z.object({
  ref: z.string().optional(),
});

export const Route = createFileRoute("/$owner/$repo/_layout/")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    ref: search.ref,
  }),
  loader: async ({ params, context: { queryClient }, deps, location }) => {
    await queryClient.ensureQueryData(
      getTreeQueryOptions({
        owner: params.owner,
        repo: params.repo,
        ref: deps.ref,
        path: "",
      })
    );

    return {
      url: location.url.toString(),
    };
  },
  pendingComponent: IndexPendingComponent,
});

function IndexPendingComponent() {
  return (
    <div className="py-6">
      <div className="divide-y overflow-hidden rounded-lg border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="flex items-center gap-3 p-3" key={i}>
            <Skeleton className="size-4" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteComponent() {
  const params = Route.useParams();
  const search = Route.useSearch();
  const { owner, repo } = params;
  const { ref } = search;

  const navigate = useNavigate();
  const data = Route.useLoaderData();

  const { data: tree } = useSuspenseQuery(
    getTreeQueryOptions({
      owner,
      repo,
      ref,
      path: "",
    })
  );

  const { data: repository } = useSuspenseQuery(
    getRepoByOwnerAndNameOpts({
      owner,
      name: repo,
    })
  );

  const url = new URL(data.url);
  const repoUrl = `${url.origin ?? window.location.origin}/${owner}/${repo}.git`;

  // If tree is empty, show instructions
  if (tree.length === 0) {
    return (
      <EmptyRepositoryInstructions
        isPrivate={repository.isPrivate}
        owner={owner}
        repo={repo}
      />
    );
  }

  // Sort tree: directories first, then files
  const sortedTree = [...tree].sort((a, b) => {
    const aIsDir = a.type === "tree";
    const bIsDir = b.type === "tree";

    if (aIsDir !== bIsDir) {
      return aIsDir ? -1 : 1;
    }

    return a.path.localeCompare(b.path);
  });

  // Find README file (case-insensitive)
  const readmeEntry = tree.find((entry) =>
    /^readme(\.(md|mdx|markdown|txt))?$/i.test(entry.path)
  );

  return (
    <div className="space-y-6">
      {repository.description && (
        <p className="text-muted-foreground">{repository.description}</p>
      )}
      <div className="flex items-center justify-between gap-4">
        <BranchSelector
          onBranchChange={(newBranch) => {
            navigate({
              to: ".",
              search: { ref: newBranch },
            });
          }}
          owner={owner}
          repo={repo}
          selectedBranch={ref}
        />
        <CloneButton repoUrl={repoUrl} />
      </div>
      <div className="divide-y overflow-hidden rounded-lg border">
        {sortedTree.map((entry) => {
          const isDirectory = entry.type === "tree";
          const newPath = entry.path;

          return (
            <Link
              className="grid grid-cols-[300px_minmax(0,1fr)_auto] items-center gap-4 p-3 transition-colors hover:bg-muted/50"
              key={entry.oid}
              params={{ owner, repo }}
              search={{
                ref,
                path: newPath,
              }}
              to={isDirectory ? "/$owner/$repo/tree" : "/$owner/$repo/blob"}
            >
              {/* Left: File/Directory Name */}
              <div className="flex min-w-0 items-center gap-3">
                {isDirectory ? (
                  <FolderIcon className="size-4 shrink-0 text-blue-400" />
                ) : (
                  <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate text-sm">{entry.path}</span>
              </div>

              {entry.lastCommit && (
                <span
                  className="truncate text-muted-foreground text-sm"
                  title={entry.lastCommit.commit.message}
                >
                  {entry.lastCommit.commit.message.split("\n")[0]}
                </span>
              )}
              {!entry.lastCommit && <span />}

              {entry.lastCommit && (
                <span className="shrink-0 text-muted-foreground text-sm">
                  {formatDate(entry.lastCommit.commit.committer.timestamp)}
                </span>
              )}
              {!entry.lastCommit && <span />}
            </Link>
          );
        })}
      </div>

      {readmeEntry && (
        <ReadmeViewer
          filepath={readmeEntry.path}
          owner={owner}
          ref={ref}
          repo={repo}
        />
      )}
    </div>
  );
}

function CloneButton({ repoUrl }: { repoUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(repoUrl);
    setCopied(true);
    toast.success(m.repo_copied());
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CodeIcon className="size-4" />
          Code
          <span className="text-[9px]">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-100">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{m.repo_clone_repo()}</h4>
            <p className="mt-1 text-muted-foreground text-xs">
              {m.repo_clone_desc()}
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-xs">{m.repo_https()}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-x-auto rounded-md border bg-muted px-3 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <code className="whitespace-nowrap text-xs">{repoUrl}</code>
              </div>
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ReadmeViewer({
  owner,
  repo,
  ref,
  filepath,
}: {
  owner: string;
  repo: string;
  ref?: string;
  filepath: string;
}) {
  const { data: blob } = useSuspenseQuery(
    getBlobQueryOptions({
      owner,
      repo,
      ref,
      filepath,
    })
  );

  if (!blob || blob.isBinary) {
    return null;
  }

  const content = decodeURIComponent(
    atob(blob.content)
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );

  const isMarkdown = filepath.toLowerCase().match(/\.(md|mdx|markdown)$/);

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-2 border-b bg-card px-4 py-3">
        <BookOpenIcon className="size-4" />
        <span className="font-semibold text-sm">{filepath}</span>
      </div>
      <div className="p-6">
        {isMarkdown ? (
          <ReactMarkdown
            components={components}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <pre className="overflow-x-auto font-mono text-sm">{content}</pre>
        )}
      </div>
    </div>
  );
}

function EmptyRepositoryInstructions({
  owner,
  repo,
  isPrivate,
}: {
  owner: string;
  repo: string;
  isPrivate: boolean;
}) {
  const data = Route.useLoaderData();
  const url = new URL(data.url);

  const repoUrl = `${url.origin ?? window.location.origin}/${owner}/${repo}.git`;

  return (
    <div>
      <div className="mx-auto space-y-6">
        <div className="text-center">
          <h2 className="font-bold text-xl">{m.repo_empty_repo()}</h2>
          <p className="mt-2 text-muted-foreground">
            {m.repo_empty_repo_desc()}
          </p>
        </div>

        <Card>
          <CardContent className="text-sm">
            <CardTitle className="mb-3">Note</CardTitle>
            <div className="leading-relaxed">
              {isPrivate ? (
                <p>{m.repo_private_repo_desc()}</p>
              ) : (
                <p>{m.repo_public_repo_desc()}</p>
              )}{" "}
              <p>
                Create one in{" "}
                <Link
                  className="font-medium underline underline-offset-4"
                  to="/settings"
                >
                  {m.repo_create_in_settings()}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TerminalIcon className="size-5" />
              {m.repo_create_new_repo()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <CodeBlock
                code={`echo "# ${repo}" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin ${repoUrl}
git push -u origin main`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TerminalIcon className="size-4" />
              {m.repo_push_existing()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              code={`git remote add origin ${repoUrl}
git branch -M main
git push -u origin main`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre>
      <code className="text-sm leading-relaxed">{code}</code>
    </pre>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return formatRelative(date);
}
