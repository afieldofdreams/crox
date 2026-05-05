import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://crox.io',
  integrations: [
    react(),
    sitemap(),
  ],
  redirects: {
    '/ai-integration': '/experiments',
  },
  build: {
    format: 'directory',
  },
});
