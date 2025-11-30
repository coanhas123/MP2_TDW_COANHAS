import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path configuration
// IMPORTANT: Change '/flower-explorer/' to match your repository name
// - For project pages (username.github.io/repo-name): use '/repo-name/'
// - For user/organization pages (username.github.io): use '/'
// 
// Example: if your repo is 'alice/my-flowers', change to '/my-flowers/'
const REPO_NAME = '/flower-explorer/'; // ⬅️ CHANGE THIS to your repo name!

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // In production, use the repo name as base path
  // In development, use root path for local dev server
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
