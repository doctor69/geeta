// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://doctor69.github.io',
  base: '/geeta',
  output: 'static',
  integrations: [react()],
});
