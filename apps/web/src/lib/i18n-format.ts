import { format, formatDistanceToNow } from "date-fns";
import { enUS, zhCN } from "date-fns/locale";
import { getLocale } from "@/paraglide/runtime";

export function getDateLocale() {
  return getLocale() === "zh" ? zhCN : enUS;
}

export function formatDate(date: Date | number, pattern = "PPP") {
  return format(date, pattern, { locale: getDateLocale() });
}

export function formatRelative(date: Date | number) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: getDateLocale(),
  });
}
