const SITE_URL = "https://toolboxi.uz";
const SOCIAL_IMAGE = `${SITE_URL}/og.jpg`;

function canonicalUrl(path: string) {
  if (path === "/") return `${SITE_URL}/`;
  const normalized = `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return `${SITE_URL}${normalized}`;
}

export function seoHead({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}) {
  const canonical = canonicalUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(noIndex ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Toolboxi.uz" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

