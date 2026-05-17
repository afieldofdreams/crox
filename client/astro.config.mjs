import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://crox.io',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
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
