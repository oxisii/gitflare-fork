import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { listPersonalAccessTokens } from "@/api/pat";
import { getSessionOptions } from "@/api/session";
import { NotFoundComponent } from "@/components/404-components";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { avatarSrc } from "@/lib/avatar";
import { formatRelative } from "@/lib/i18n-format";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/_layout/settings")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  loader: async ({ context: { queryClient } }) => {
    const data = await queryClient.ensureQueryData(getSessionOptions);
    if (!data) {
      throw redirect({ to: "/" });
    }
  },
  pendingComponent: PendingComponent,
});

function PendingComponent() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="mb-6 font-bold text-3xl">{m.settings_title()}</h1>

      <Tabs defaultValue="profile" onChange={() => {}} value="profile">
        <TabsList>
          <TabsTrigger value="profile">{m.settings_profile_tab()}</TabsTrigger>
          <TabsTrigger value="tokens">
            {m.settings_personal_access_tokens()}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="rounded-lg border p-6">
            <Skeleton className="mb-6 h-6 w-40" />

            <div className="mb-6 flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RouteComponent() {
  const { data: session, isLoading } = useSuspenseQuery(getSessionOptions);

  if (isLoading) {
    return <PendingComponent />;
  }

  const user = session?.user;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="mb-6 font-bold text-3xl">{m.settings_title()}</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">{m.settings_profile_tab()}</TabsTrigger>
          <TabsTrigger value="tokens">
            {m.settings_personal_access_tokens()}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings
            email={user?.email ?? "NO_EMAIL"}
            image={user?.image ?? ""}
            name={user?.name ?? "NO_NAME"}
            username={user?.username ?? "NO_USERNAME"}
          />
          <LanguageSettings />
        </TabsContent>

        <TabsContent value="tokens">
          <PersonalAccessTokens />
        </TabsContent>
      </Tabs>
    </div>
  );
}

type ProfileSettingsProps = {
  name: string;
  email: string;
  username: string;
  image: string;
};

function ProfileSettings({ name, email, username, image }: ProfileSettingsProps) {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; image: string }) => {
      const result = await authClient.updateUser({
        name: data.name,
        image: data.image.trim() || "",
      });
      if (result.error) {
        throw new Error(
          result.error.message || m.settings_profile_update_failed()
        );
      }
      await queryClient.refetchQueries({
        queryKey: getSessionOptions.queryKey,
      });
      return result.data;
    },
    onSuccess: async () => {
      toast.success(m.settings_profile_updated());
    },
    onError: (error: Error) => {
      toast.error(error.message || m.settings_profile_update_failed());
    },
  });

  const form = useForm({
    defaultValues: {
      name,
      image,
    },
    onSubmit: async ({ value }) => {
      await updateProfileMutation.mutateAsync(value);
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, m.settings_name_min()),
        image: z
          .string()
          .refine(
            (v) => v.trim() === "" || /^https?:\/\//.test(v.trim()),
            m.settings_avatar_url_invalid()
          ),
      }),
    },
  });

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-6 font-semibold text-lg">
        {m.settings_profile_info()}
      </h2>

      <div className="mb-6 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage alt={`@${username}`} src={avatarSrc(image)} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((w) => w.at(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-lg">{name}</p>
          <p className="text-muted-foreground text-sm">@{username}</p>
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.settings_name()}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={name}
                  value={field.state.value}
                />
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500 text-sm" key={error?.message}>
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="image">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.settings_avatar_url()}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://"
                  value={field.state.value}
                />
                <p className="text-muted-foreground text-xs">
                  {m.settings_avatar_url_hint()}
                </p>
                {field.state.meta.errors.map((error) => (
                  <p className="text-red-500 text-sm" key={error?.message}>
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">{m.settings_username()}</Label>
          <Input disabled id="username" value={username} />
          <p className="text-muted-foreground text-xs">
            {m.settings_username_fixed()}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{m.settings_email()}</Label>
          <Input disabled id="email" type="email" value={email} />
          <p className="text-muted-foreground text-xs">
            {m.settings_email_fixed()}
          </p>
        </div>
        <Button loading={updateProfileMutation.isPending} type="submit">
          {m.settings_save_changes()}
        </Button>
      </form>
    </div>
  );
}

function LanguageSettings() {
  return (
    <div className="mt-6 rounded-lg border p-6">
      <h2 className="mb-4 font-semibold text-lg">{m.settings_language()}</h2>
      <LanguageSwitcher />
    </div>
  );
}

function PersonalAccessTokens() {
  const { data, isLoading } = useQuery(listPersonalAccessTokens);
  const queryClient = useQueryClient();

  const [showNewTokenDialog, setShowNewTokenDialog] = useState(false);
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<string | null>(
    null
  );
  const [isCopied, setIsCopied] = useState(false);

  const createPATMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await authClient.apiKey.create({
        name,
        prefix: "gvx_",
      });
      if (error) {
        throw new Error(error.message || m.settings_failed_create_pat());
      }
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: listPersonalAccessTokens.queryKey,
      });
      setNewlyCreatedToken(data.key);
      setShowNewTokenDialog(false);
      toast.success(m.settings_token_created());
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || m.settings_failed_create_pat());
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      await createPATMutation.mutateAsync(value.name);
      form.reset();
    },
    validators: {
      onSubmit: z.object({
        name: z
          .string()
          .min(3, m.settings_token_name_min())
          .max(50, m.settings_token_name_max()),
      }),
    },
  });

  if (isLoading) {
    return <PersonalAccessTokensSkeleton />;
  }

  const tokens = data || [];

  const handleCopyToken = (token: string) => {
    if (!token) {
      toast.error(m.settings_no_token_to_copy());
      return;
    }
    navigator.clipboard.writeText(token);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <div className="mb-6">
          <h2 className="mb-2 font-semibold text-lg">
            {m.settings_personal_access_tokens()}
          </h2>
          <p className="text-muted-foreground text-sm">
            {m.settings_pat_description()}
          </p>
        </div>

        <Button onClick={() => setShowNewTokenDialog(true)}>
          {m.settings_create_token()}
        </Button>

        {/* Create Token Dialog */}
        <Dialog onOpenChange={setShowNewTokenDialog} open={showNewTokenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{m.settings_create_pat_title()}</DialogTitle>
              <DialogDescription>
                {m.settings_create_pat_desc()}
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-2 py-4">
                    <Label htmlFor={field.name}>{m.settings_pat_name()}</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={m.settings_pat_name_placeholder()}
                      value={field.state.value}
                    />
                    <p className="text-muted-foreground text-xs">
                      {m.settings_pat_purpose()}
                    </p>
                    {field.state.meta.errors.map((error) => (
                      <p
                        className="text-destructive text-sm"
                        key={error?.message}
                      >
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setShowNewTokenDialog(false);
                    form.reset();
                  }}
                  type="button"
                  variant="outline"
                >
                  {m.settings_cancel()}
                </Button>
                <Button loading={createPATMutation.isPending} type="submit">
                  {m.settings_generate_token()}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {newlyCreatedToken && (
          <div className="my-5">
            <h2 className="font-semibold text-lg">
              {m.settings_generated_token()}
            </h2>
            <p className="mb-2 text-muted-foreground text-sm">
              {m.settings_copy_now()}
            </p>
            <div className="flex items-center gap-2">
              <code className="block overflow-x-auto whitespace-nowrap rounded border bg-muted p-2 font-mono text-sm">
                {newlyCreatedToken}
              </code>

              <Button
                className="shrink-0"
                onClick={() => handleCopyToken(newlyCreatedToken || "")}
                size="icon"
                variant="outline"
              >
                {isCopied ? (
                  <CheckIcon className="size-4 text-green-600" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {tokens.length > 0 && (
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 font-semibold text-base">
            {m.settings_your_tokens()}
          </h3>
          <div className="space-y-3">
            {tokens.map((token) => (
              <TokenCard
                createdAt={token.createdAt}
                id={token.id}
                key={token.id}
                lastRequest={token.lastRequest}
                name={token.name ?? m.settings_unnamed_token()}
                start={token.start ?? "gvx_xxx"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const formatDate = (date: Date) => formatRelative(date);

type TokenCardProps = {
  id: string;
  name: string;
  start: string;
  createdAt: Date;
  lastRequest: Date | null;
};

function TokenCard({
  id,
  name,
  start,
  createdAt,
  lastRequest,
}: TokenCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const { data, error } = await authClient.apiKey.delete({
        keyId: tokenId,
      });
      if (error || !data.success) {
        throw new Error(error?.message || m.settings_failed_delete_pat());
      }
      await queryClient.refetchQueries({
        queryKey: listPersonalAccessTokens.queryKey,
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || m.settings_failed_delete_pat());
    },
  });
  return (
    <Card className="p-4" key={id}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2">
            <h4 className="font-semibold text-sm">{name}</h4>
          </div>
          <div className="space-y-1 text-muted-foreground text-xs">
            <p>
              {m.settings_pat_created()}: {formatDate(createdAt)}
            </p>
            <p>
              {m.settings_pat_last_used()}:{" "}
              {lastRequest ? formatDate(lastRequest) : m.settings_pat_never()}
            </p>
            <code className="text-xs">{`${start}.....`}</code>
          </div>
        </div>

        <Button
          loading={deleteMutation.isPending}
          onClick={() => {
            deleteMutation.mutate(id);
          }}
          size="icon"
          variant="outline"
        >
          <Trash2Icon />
        </Button>
      </div>
    </Card>
  );
}

function PersonalAccessTokensSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <Skeleton className="mb-2 h-6 w-48" />
        <Skeleton className="mb-6 h-4 w-full max-w-2xl" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="rounded-lg border p-6">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-36" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
