import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import widgetRegistry from './plugins/widget-registry'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    widgetRegistry()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
