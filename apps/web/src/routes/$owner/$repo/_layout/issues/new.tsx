import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createIssueFn } from "@/api/issues";
import { NotFoundComponent } from "@/components/404-components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/$owner/$repo/_layout/issues/new")({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const params = Route.useParams();

  const formSchema = z.object({
    title: z
      .string()
      .min(1, { message: m.issue_title_required() })
      .max(200, { message: m.issue_title_too_long() }),
    body: z.string().max(10_000, {
      message: m.issue_desc_too_long(),
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const createIssueMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      await createIssueFn({
        data: {
          body: values.body.trim() || "",
          title: values.title,
          owner: params.owner,
          repo: params.repo,
        },
      }),
    onSuccess: () => {
      toast.success(m.issue_success());
      form.reset();
      navigate({
        to: "/$owner/$repo/issues",
        params: {
          owner: params.owner,
          repo: params.repo,
        },
      });
    },
    onError: (err) => {
      console.error("Error creating issue:", err);
      toast.error(err.message);
    },
  });

  const onSubmit = (values: FormValues) => {
    createIssueMutation.mutate({
      title: values.title,
      body: values.body,
    });
  };

  const isSubmitting = createIssueMutation.isPending;

  return (
    <div className="container mx-auto my-10 px-5 md:px-0">
      <Card className="mx-auto max-w-3xl bg-background">
        <CardHeader>
          <CardTitle>{m.issue_create_title()}</CardTitle>
        </CardHeader>
        <CardContent>
          {createIssueMutation.error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>{m.issue_error()}</AlertTitle>
              <AlertDescription>
                {createIssueMutation.error.message ?? m.issue_failed_create()}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{m.issue_title()}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={m.issue_title_placeholder()}
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
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{m.issue_description()}</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] resize-y"
                        placeholder={m.issue_description_placeholder()}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  params={params}
                  to="/$owner/$repo/issues"
                >
                  {m.issue_cancel()}
                </Link>
                <Button loading={isSubmitting} type="submit">
                  {m.issue_create()}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
