import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { createRepoFn, createRepoSchema } from "@/api/repos";
import { NotFoundComponent } from "@/components/404-components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_layout/new")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

type FormValues = z.infer<typeof createRepoSchema>;

function RouteComponent() {
  const t = useT();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(createRepoSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  const createRepoMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      await createRepoFn({
        data: values,
      }),
    onSuccess: ({ owner, name }) => {
      toast.success(t("newRepo.success"));
      form.reset();
      navigate({
        to: "/$owner/$repo",
        params: {
          owner,
          repo: name,
        },
      });
    },
    onError: (err) => {
      console.error("Error creating repository:", err);
      toast.error(err.message);
    },
  });

  const onSubmit = (values: FormValues) => {
    createRepoMutation.mutate({
      ...values,
      description: values.description.trim() || "",
    });
  };

  const isSubmitting = createRepoMutation.isPending;

  return (
    <div className="container mx-auto my-10 px-5 md:px-0">
      <Card className="mx-auto max-w-xl bg-background">
        <CardHeader>
          <CardTitle>{t("newRepo.title")}</CardTitle>
          <CardDescription>
            A repository contains all project files, including the revision
            history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {createRepoMutation.error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {createRepoMutation.error.message ??
                  "Failed to create repository"}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newRepo.repositoryName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("newRepo.repositoryNamePlaceholder")}
                        {...field}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const formatted = e.target.value
                            .replace(/\s+/g, "-")
                            .replace(/[^a-zA-Z0-9_-]/g, "");
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newRepo.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder={t("newRepo.descriptionPlaceholder")}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newRepo.visibility")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="w-full gap-2 md:flex"
                        disabled={isSubmitting}
                        onValueChange={(value) =>
                          field.onChange(value === "private")
                        }
                        value={field.value ? "private" : "public"}
                      >
                        <Label className="flex flex-1 items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                          <RadioGroupItem value="public" />
                          <div className="flex flex-col gap-1">
                            <p className="text-sm leading-4">
                              {t("newRepo.public")}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {t("newRepo.publicDesc")}
                            </p>
                          </div>
                        </Label>
                        <Label className="flex flex-1 items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                          <RadioGroupItem value="private" />
                          <div className="flex flex-col gap-1">
                            <p className="text-sm leading-4">
                              {t("newRepo.private")}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {t("newRepo.privateDesc")}
                            </p>
                          </div>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button loading={isSubmitting} type="submit">
                  {t("newRepo.create")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
