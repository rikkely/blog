import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
//
// base: './'  →  fully relative asset URLs, so the built dist/ can be served
// from ANY path (e.g. https://your-domain/blog/) with zero rewrite rules.
// Routing is hash-based, so no nginx try_files fallback is required either.
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    host: true,
    // different default port from the home app (5173) so both can run at once
    port: process.env.PORT ? Number(process.env.PORT) : 5174
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1500
  }
})
