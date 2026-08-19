import type { ErrorComponentProps } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import * as m from "@/paraglide/messages";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function ErrorComponent({ error, info }: ErrorComponentProps) {
  const errorMessage = error.message;
  console.log(info);
  return (
    <div className="p-4">
      <Alert className="mb-6" variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>{m.error_title()}</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    </div>
  );
}
