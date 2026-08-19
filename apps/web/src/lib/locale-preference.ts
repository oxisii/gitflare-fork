import { authClient } from "@/lib/auth-client";
import { getLocale, setLocale } from "@/paraglide/runtime";

export type AppLocale = "en" | "zh";

export function isAppLocale(value: unknown): value is AppLocale {
  return value === "en" || value === "zh";
}

export function applySavedLocale(saved: unknown) {
  if (!isAppLocale(saved)) {
    return;
  }
  if (getLocale() !== saved) {
    setLocale(saved);
  }
}

export async function persistLocale(locale: AppLocale) {
  const { data } = await authClient.getSession();
  if (data?.user) {
    await authClient.updateUser({
      locale,
    } as Parameters<typeof authClient.updateUser>[0]);
  }
  applySavedLocale(locale);
}
