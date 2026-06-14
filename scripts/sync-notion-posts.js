import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outPath = path.join(root, "src", "data", "posts.json");

const NOTION_VERSION = "2025-09-03";
const optional = process.argv.includes("--optional");

const token = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
const dataSourceId =
  process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID;

const propertyNames = {
  title: process.env.NOTION_TITLE_PROP || "Title",
  slug: process.env.NOTION_SLUG_PROP || "Slug",
  status: process.env.NOTION_STATUS_PROP || "Status",
  published: process.env.NOTION_PUBLISHED_PROP || "Published",
  date: process.env.NOTION_DATE_PROP || "Date",
  tag: process.env.NOTION_TAG_PROP || "Tag",
  summary: process.env.NOTION_SUMMARY_PROP || "Summary",
  description: process.env.NOTION_DESCRIPTION_PROP || "Description",
  cover: process.env.NOTION_COVER_PROP || "Cover",
};

function logSkip(message) {
  if (optional) {
    console.log(`Notion sync omitido: ${message}`);
    return;
  }
  throw new Error(message);
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function richText(value) {
  const items = value?.rich_text || value?.title || [];
  return items.map((item) => item?.plain_text || "").join("").trim();
}

function propText(properties, name) {
  return richText(properties?.[name]);
}

function firstPropByType(properties, type) {
  return Object.values(properties || {}).find((prop) => prop?.type === type);
}

function titleText(properties) {
  return propText(properties, propertyNames.title) || richText(firstPropByType(properties, "title"));
}

function propDate(properties, name) {
  return properties?.[name]?.date?.start || "";
}

function propSelect(properties, name) {
  const prop = properties?.[name];
  if (prop?.select?.name) return prop.select.name;
  if (prop?.status?.name) return prop.status.name;
  if (Array.isArray(prop?.multi_select) && prop.multi_select.length > 0) {
    return prop.multi_select.map((item) => item.name).join(", ");
  }
  return "";
}

function propCheckbox(properties, name) {
  return Boolean(properties?.[name]?.checkbox);
}

function isPublished(properties) {
  const checkbox = properties?.[propertyNames.published];
  if (checkbox?.type === "checkbox") return Boolean(checkbox.checkbox);

  const status = propSelect(properties, propertyNames.status).toLowerCase();
  if (!status) return false;

  return ["published", "publicado", "live", "activo"].includes(status);
}

function propFileUrl(properties, name) {
  const files = properties?.[name]?.files || [];
  const first = files[0];
  return first?.external?.url || first?.file?.url || "";
}

function pageCoverUrl(page) {
  return page?.cover?.external?.url || page?.cover?.file?.url || "";
}

function textFromBlock(block) {
  const value = block?.[block.type];
  return (value?.rich_text || [])
    .map((item) => item?.plain_text || "")
    .join("")
    .trim();
}

function imageUrlFromBlock(block) {
  const image = block?.image;
  return image?.external?.url || image?.file?.url || "";
}

function normalizeBlocks(blocks) {
  const normalized = [];

  for (const block of blocks) {
    if (!block?.type) continue;

    if (["heading_1", "heading_2", "heading_3"].includes(block.type)) {
      const title = textFromBlock(block);
      if (title) normalized.push({ title });
      continue;
    }

    if (block.type === "paragraph" || block.type === "quote") {
      const text = textFromBlock(block);
      if (text) normalized.push({ text });
      continue;
    }

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const item = textFromBlock(block);
      if (!item) continue;
      const previous = normalized.at(-1);
      if (previous && Array.isArray(previous.items) && !previous.text) {
        previous.items.push(item);
      } else {
        normalized.push({ items: [item] });
      }
      continue;
    }

    if (block.type === "image") {
      const url = imageUrlFromBlock(block);
      const caption = (block.image?.caption || [])
        .map((item) => item?.plain_text || "")
        .join("")
        .trim();
      if (url) normalized.push({ image: url, title: caption });
    }
  }

  return normalized;
}

async function notionFetch(endpoint, options = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Notion ${response.status}: ${body}`);
  }

  return response.json();
}

async function queryPages() {
  const sorts = [
    { timestamp: "last_edited_time", direction: "descending" },
  ];

  const results = [];
  let start_cursor;

  do {
    const payload = await notionFetch(`/data_sources/${dataSourceId}/query`, {
      method: "POST",
      body: JSON.stringify({ page_size: 100, start_cursor, sorts }),
    });
    results.push(...(payload.results || []));
    start_cursor = payload.has_more ? payload.next_cursor : undefined;
  } while (start_cursor);

  return results;
}

async function getBlockChildren(blockId) {
  const results = [];
  let start_cursor;

  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (start_cursor) query.set("start_cursor", start_cursor);
    const payload = await notionFetch(`/blocks/${blockId}/children?${query}`);
    results.push(...(payload.results || []));
    start_cursor = payload.has_more ? payload.next_cursor : undefined;
  } while (start_cursor);

  return results;
}

async function loadFallbackPosts() {
  try {
    return JSON.parse(await readFile(outPath, "utf8"));
  } catch {
    return [];
  }
}

async function main() {
  if (!token || !dataSourceId) {
    logSkip("faltan NOTION_TOKEN y/o NOTION_DATA_SOURCE_ID");
    return;
  }

  const pages = await queryPages();
  const posts = [];

  for (const page of pages) {
    const properties = page.properties || {};
    if (!isPublished(properties)) continue;

    const title = titleText(properties);
    if (!title) continue;

    const explicitSlug = propText(properties, propertyNames.slug);
    const summary = propText(properties, propertyNames.summary);
    const description = propText(properties, propertyNames.description);
    const tag = propSelect(properties, propertyNames.tag);
    const date = propDate(properties, propertyNames.date);
    const cover =
      propFileUrl(properties, propertyNames.cover) || pageCoverUrl(page);
    const blocks = normalizeBlocks(await getBlockChildren(page.id));

    posts.push({
      slug: explicitSlug ? slugify(explicitSlug) : slugify(title),
      title,
      ...(description && { description }),
      ...(tag && { tag }),
      ...(summary && { summary }),
      ...(cover && { cover }),
      blocks,
      ...(date && { date }),
      notionPageId: page.id,
    });
  }

  if (posts.length === 0) {
    const fallback = await loadFallbackPosts();
    await writeFile(outPath, `${JSON.stringify(fallback, null, 2)}\n`, "utf8");
    console.log("Notion sync: sin posts publicados; se conservaron los posts actuales.");
    return;
  }

  await writeFile(outPath, `${JSON.stringify(posts, null, 2)}\n`, "utf8");
  console.log(`Notion sync: ${posts.length} posts publicados -> ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
