import fs from 'fs';
import path from 'path';
import { generateSitemapXml } from '../src/utils/sitemapGenerator.ts';
import { IceMachine } from '../src/types/iceMachine.ts';
import { BLOG_ARTICLES } from '../src/data/blogArticles.ts';

const rootDir = process.cwd();
const jsonPath = path.join(rootDir, 'public', 'ice_machines.json');
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');

try {
  console.log('Reading commercial ice machine database from:', jsonPath);
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const machines: IceMachine[] = JSON.parse(rawData);

  console.log(`Found ${machines.length} ice machines. Generating dynamic XML sitemap...`);
  const sitemapXml = generateSitemapXml(machines, 'https://koldspec.com');

  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  const totalUrls = machines.length + 2 + BLOG_ARTICLES.length;
  console.log(`Successfully generated sitemap with ${totalUrls} URLs at ${sitemapPath}`);
} catch (err) {
  console.error('Failed to generate sitemap.xml:', err);
  process.exit(1);
}
