export function avatarSrc(image: string | null | undefined): string | undefined {
  const url = image?.trim();
  return url ? url : undefined;
}

export function applyFavicon(image: string | null | undefined) {
  if (typeof document === "undefined") {
    return;
  }
  const href = avatarSrc(image) ?? "/logo.svg";
  let link = document.querySelector('link[rel="icon"]');
  if (!(link instanceof HTMLLinkElement)) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
  link.removeAttribute("type");
}
