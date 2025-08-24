import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    mdx()
  ],
  vite: {
    optimizeDeps: {
      exclude: ['sharp']
    }
  },
  image: {
    domains: ['images.unsplash.com', 'videos.pexels.com']
  }
});