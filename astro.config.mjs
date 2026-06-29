// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.NETLIFY
    ? (process.env.URL ?? 'https://xuezhenzong-portfolio.netlify.app')
    : 'https://lumina1115.github.io',
  base: process.env.NETLIFY ? '/' : '/portfolio',
  integrations: [mdx(), sitemap()],
});
