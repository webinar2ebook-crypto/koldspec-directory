import { IceMachine } from '../types/iceMachine';
import { BLOG_ARTICLES } from '../data/blogArticles';

export const DOMAIN = 'https://koldspec.com';

/**
 * Convert a machine's brand and model number into a URL-friendly slug.
 * Example: "Hoshizaki" + "KM-1900SAJ3" -> "hoshizaki-km-1900saj3"
 */
export function getBaseMachineSlug(machine: IceMachine): string {
  const brand = (machine.brand || '').toLowerCase();
  const model = (machine.modelNumber || '').toLowerCase();
  return `${brand}-${model}`
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Builds a deterministic mapping of machine IDs to unique URL slugs.
 * If identical model numbers exist, subsequent duplicates are suffixed with -2, -3, etc.
 */
export function buildMachineSlugMap(machines: IceMachine[]): Map<string, string> {
  const slugCounts = new Map<string, number>();
  const idToSlug = new Map<string, string>();

  for (const m of machines) {
    const base = getBaseMachineSlug(m);
    const count = slugCounts.get(base) || 0;
    slugCounts.set(base, count + 1);

    const slug = count === 0 ? base : `${base}-${count + 1}`;
    idToSlug.set(m.id, slug);
  }

  return idToSlug;
}

/**
 * Find a machine from the dataset by its URL slug.
 */
export function findMachineBySlug(
  machines: IceMachine[],
  slug: string
): IceMachine | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  const slugMap = buildMachineSlugMap(machines);

  for (const m of machines) {
    if (slugMap.get(m.id) === cleanSlug) {
      return m;
    }
  }

  // Fallback: search by base slug match
  return machines.find((m) => getBaseMachineSlug(m) === cleanSlug);
}

/**
 * Formats a date into YYYY-MM-DD for sitemap <lastmod>.
 */
function formatDate(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Dynamically generates standard XML Sitemap content containing the homepage,
 * blog guides hub, article pages, and a unique URL for every commercial ice machine in the database.
 */
export function generateSitemapXml(
  machines: IceMachine[],
  domain: string = DOMAIN,
  lastmod: string = formatDate()
): string {
  const slugMap = buildMachineSlugMap(machines);

  const urls: string[] = [];

  // 1. Homepage
  urls.push(`  <url>
    <loc>${domain}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 2. Blog / Guides Hub
  urls.push(`  <url>
    <loc>${domain}/blog</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

  // 3. Get a Quote Page
  urls.push(`  <url>
    <loc>${domain}/quote</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);

  // 3. Blog Articles
  for (const article of BLOG_ARTICLES) {
    let articleMod = lastmod;
    if (article.publishDate) {
      const parsed = new Date(article.publishDate);
      if (!isNaN(parsed.getTime())) {
        articleMod = formatDate(parsed);
      }
    }

    urls.push(`  <url>
    <loc>${domain}/blog/${article.slug}</loc>
    <lastmod>${articleMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // 2. Individual Machine URLs
  for (const m of machines) {
    const slug = slugMap.get(m.id);
    if (!slug) continue;

    // Use machine certification date if valid, otherwise fallback to today's date
    let modDate = lastmod;
    if (m.certifiedDate && m.certifiedDate.includes('/')) {
      const parts = m.certifiedDate.split('/');
      if (parts.length === 3) {
        // MM/DD/YYYY
        modDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
      }
    }

    // High capacity machines (>500 lbs) or popular commercial units receive higher priority
    const priority = m.harvestRateLbs >= 500 ? '0.9' : '0.8';

    urls.push(`  <url>
    <loc>${domain}/machine/${slug}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}
