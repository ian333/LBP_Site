import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    react(),
    tailwind()
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