import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocale, locales, setLocale } from "@/paraglide/runtime";

const LABELS: Record<(typeof locales)[number], string> = {
  en: "English",
  zh: "中文",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const current = getLocale();

  return (
    <Select
      onValueChange={(value) => {
        if (value === "en" || value === "zh") {
          setLocale(value);
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
