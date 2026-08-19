import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSessionOptions } from "@/api/session";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applySavedLocale,
  isAppLocale,
  persistLocale,
} from "@/lib/locale-preference";
import { getLocale, locales } from "@/paraglide/runtime";

const LABELS: Record<(typeof locales)[number], string> = {
  en: "English",
  zh: "中文",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const current = getLocale();

  return (
    <Select
      onValueChange={(value) => {
        if (isAppLocale(value)) {
          void persistLocale(value);
        }
      }}
      value={current}
    >
      <SelectTrigger className={className ?? "w-[120px]"} size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {LABELS[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function LocaleSync() {
  const { data } = useQuery(getSessionOptions);

  useEffect(() => {
    const saved = data?.user
      ? (data.user as { locale?: unknown }).locale
      : undefined;
    applySavedLocale(saved);
  }, [data?.user]);

  return null;
}
