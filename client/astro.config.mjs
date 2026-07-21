import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { blogPosts } from './src/content/blogPosts';
import { learnPosts } from './src/content/learnPosts';

// Map each article URL to its published date so the sitemap advertises an
// accurate per-page lastmod instead of a uniform build timestamp.
const lastmodByPath = new Map([
  ...blogPosts.map((p) => [`/insights/${p.slug}/`, p.dateISO]),
  ...learnPosts.map((p) => [`/learn/${p.slug}/`, p.dateISO]),
]);

export default defineConfig({
  site: 'https://crox.io',
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const dateISO = lastmodByPath.get(path);
        if (dateISO) {
          item.lastmod = new Date(`${dateISO}T00:00:00Z`).toISOString();
        }
        return item;
      },
    }),
  ],
  redirects: {
    '/ai-integration': '/experiments',
    '/readiness': '/mapping',
  },
  build: {
    format: 'directory',
  },
});
