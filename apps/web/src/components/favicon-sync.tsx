import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSessionOptions } from "@/api/session";
import { applyFavicon } from "@/lib/avatar";

export function FaviconSync() {
  const { data } = useQuery(getSessionOptions);

  useEffect(() => {
    applyFavicon(data?.user?.image);
  }, [data?.user?.image]);

  return null;
}
