// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lumina1115.github.io',
  base: '/portfolio',
  integrations: [mdx(), sitemap()],
});