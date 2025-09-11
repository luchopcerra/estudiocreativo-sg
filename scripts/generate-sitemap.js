import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const BASE = 'https://estudiocreativo-sg.com';

function urlSlug(slug) {
  try {
    return encodeURIComponent(decodeURIComponent(slug));
  } catch {
    // si no es decodificable, encodéalo tal cual
    return encodeURIComponent(slug);
  }
}

async function loadJson(rel) {
  const p = path.join(root, rel);
  const text = await readFile(p, 'utf8');
  return JSON.parse(text);
}

function entry(loc, priority = '0.8', changefreq = 'monthly') {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const projects = await loadJson('src/data/projects.json');
  const posts = await loadJson('src/data/posts.json');

  const urls = [];
  urls.push(entry(`${BASE}/`, '1.0'));

  for (const p of projects) {
    if (!p?.slug) continue;
    const s = urlSlug(p.slug);
    urls.push(entry(`${BASE}/proyecto/${s}`));
  }

  for (const p of posts) {
    if (!p?.slug) continue;
    const s = urlSlug(p.slug);
    urls.push(entry(`${BASE}/post/${s}`));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  const outPath = path.join(root, 'public', 'sitemap.xml');
  await writeFile(outPath, xml, 'utf8');
  console.log('sitemap.xml actualizado:', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

