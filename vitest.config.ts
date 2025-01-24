import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
      include: ['test/**/*.spec.ts'],
      hookTimeout: 120000,
      testTimeout: 120000,
      reporters: ['dot'],
      globalSetup: ['./test/globalSetup.ts']
    }
  })