export async function shareUrl(url: string, title: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ title, url });
      return "shared";
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return "failed";
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}

export function buildShareUrl(path: string, params: URLSearchParams): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const qs = params.toString();
  return qs ? `${origin}${path}?${qs}` : `${origin}${path}`;
}
