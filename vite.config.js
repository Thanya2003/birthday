import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps photo and audio paths relative, so the built site works from any folder or host
export default defineConfig({
  base: './',
  plugins: [react()]
});
