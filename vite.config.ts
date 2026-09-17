import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite Configuration for Notes Tok Vue 3 frontend:
 * - Enables official Vue 3 SFC compilation plugin
 * - Configures `@` path alias pointing directly to `/src`
 * - Sets development dev server port to 5173
 * - Proxies `/api` calls to ASP.NET Core backend server running on http://localhost:5291
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      // Forward /api requests to local ASP.NET Core backend server
      '/api': {
        target: 'http://localhost:5291',
        changeOrigin: true
      }
    }
  }
})
