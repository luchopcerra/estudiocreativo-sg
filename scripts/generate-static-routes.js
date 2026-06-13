import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSeo,
  businessSchema,
  routePath,
  routeSchema,
} from "../src/seo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const indexPath = path.join(dist, "index.html");

const loadJson = async (relPath) =>
  JSON.parse(await readFile(path.join(root, relPath), "utf8"));

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const replaceTag = (html, pattern, replacement) => {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `    ${replacement}\n  </head>`);
};

const setMeta = (html, selectorPattern, tag) =>
  replaceTag(html, selectorPattern, tag);

const canonicalPattern = /<link\s+[^>]*rel="canonical"[^>]*>/;
const metaNamePattern = (name) =>
  new RegExp(`<meta\\s+[^>]*name="${name}"[^>]*>`);
const metaPropertyPattern = (property) =>
  new RegExp(`<meta\\s+[^>]*property="${property}"[^>]*>`);

const setJsonLd = (html, schema) => {
  const json = JSON.stringify(schema);
  return html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${json}</script>`,
  );
};

const renderRoute = (template, route) => {
  const seo = buildSeo(route);
  const schema = [businessSchema, routeSchema({ ...route, seo })];
  let html = template;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`,
  );
  html = setMeta(
    html,
    canonicalPattern,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
  );
  html = setMeta(
    html,
    metaNamePattern("description"),
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  html = setMeta(
    html,
    metaPropertyPattern("og:title"),
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  );
  html = setMeta(
    html,
    metaPropertyPattern("og:description"),
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );
  html = setMeta(
    html,
    metaPropertyPattern("og:type"),
    `<meta property="og:type" content="${escapeHtml(seo.type)}" />`,
  );
  html = setMeta(
    html,
    metaPropertyPattern("og:url"),
    `<meta property="og:url" content="${escapeHtml(seo.url)}" />`,
  );
  html = setMeta(
    html,
    metaPropertyPattern("og:image"),
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
  );
  html = setMeta(
    html,
    metaNamePattern("twitter:title"),
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  );
  html = setMeta(
    html,
    metaNamePattern("twitter:description"),
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );
  html = setMeta(
    html,
    metaNamePattern("twitter:image"),
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
  );
  html = setJsonLd(html, schema);

  return html;
};

const writeRoute = async (template, route) => {
  const routeDir = path.join(
    dist,
    decodeURIComponent(routePath(route.urlType, route.item.slug)).replace(
      /^\//,
      "",
    ),
  );
  await mkdir(routeDir, { recursive: true });
  await writeFile(
    path.join(routeDir, "index.html"),
    renderRoute(template, route),
    "utf8",
  );
};

async function main() {
  const projects = await loadJson("src/data/projects.json");
  const posts = await loadJson("src/data/posts.json");
  const template = await readFile(indexPath, "utf8");

  for (const project of projects) {
    await writeRoute(template, {
      type: "project",
      urlType: "proyecto",
      item: project,
    });
  }

  for (const post of posts) {
    await writeRoute(template, {
      type: "post",
      urlType: "post",
      item: post,
    });
  }

  console.log(
    `static route HTML generated: ${projects.length} projects, ${posts.length} posts`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
