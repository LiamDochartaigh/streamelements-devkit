import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import widgetRegistry from './plugins/widget-registry'
import customFields from './plugins/custom-fields-types'
import customTransformer from './plugins/custom-transformer'
import socketIOServer from './plugins/vite-socket-io'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    customFields(),
    customTransformer(),
    widgetRegistry(),
    socketIOServer(),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router/auto': ['useRoute', 'useRouter'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
      include: [/\.[jt]sx?$/, /\.astro$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/],
      dirs: ['src/utils'],
    }),
    Components({
      dts: 'src/components.d.ts',
      dirs: ['src/layouts', 'src/components'],
    })
  ],
  logLevel: 'info',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
