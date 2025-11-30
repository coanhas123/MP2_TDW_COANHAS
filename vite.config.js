import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path configuration
const REPO_NAME = '/MP2_TDW_COANHAS/'; // Base path for GitHub Pages

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Use base path in production build, root path in development
  base: process.env.NODE_ENV === 'production' ? REPO_NAME : '/',
  server: {
    proxy: {
      // Proxy for Trefle API (kept for backup)
      '/trefle': {
        target: 'https://trefle.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/trefle/, ''),
      },
      // Proxy for GBIF API (in case of CORS issues)
      '/gbif': {
        target: 'https://api.gbif.org',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gbif/, ''),
      },
    },
  },
})
