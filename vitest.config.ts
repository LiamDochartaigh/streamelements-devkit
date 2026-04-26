import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['src/widgets/_utils/__tests__/setup.ts'],
  }
})
