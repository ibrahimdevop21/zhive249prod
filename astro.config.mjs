import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from "astro-compress";
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://zhive249.com',
  base: '/',
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  integrations: [
    react(),
    tailwind(),
    compress({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),
    sitemap(),
    robotsTxt()
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      include: ['@astrojs/image', 'sharp'],
    },
    ssr: {
      noExternal: ['path-to-regexp'],
    }
  }
});
