import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.svelte-kit/',
        'drizzle/',
        '*.config.*',
        'tests/e2e/'
      ]
    },
    hookTimeout: 30000, //30s
    testTimeout: 30000, //30s
    isolate: false,
    sequence: {
      shuffle: false,
      concurrent: false,
    },
  },
  envDir: './', 
  envPrefix: '*'
});