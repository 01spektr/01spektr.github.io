import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const outputRoot = join(process.cwd(), "dist", "client");
const siteUrl = "https://toolboxi.uz";

function routeFromFile(file) {
  const relativePath = relative(outputRoot, file).split(sep).join("/");
  if (relativePath === "index.html") return "/";
  return `/${relativePath.replace(/\/index\.html$/, "")}/`;
}

const files = (await readdir(outputRoot, { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name === "index.html")
  .map((entry) => join(entry.parentPath, entry.name));

const routes = [];
for (const file of files) {
  const html = await readFile(file, "utf8");
  if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) continue;
  routes.push(routeFromFile(file));
}

routes.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`).join("\n")}
</urlset>
`;

await writeFile(join(outputRoot, "sitemap.xml"), xml, "utf8");
console.log(`[sitemap] wrote ${routes.length} canonical URLs`);

