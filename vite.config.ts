import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH viene impostato dalla GitHub Action (es. "/flipper-hub/").
// In locale, su Cloudflare Pages o su Vercel resta "/".
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
});
