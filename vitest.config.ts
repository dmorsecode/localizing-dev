import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.ts'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
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
  envPrefix: '*',
  resolve: {
    alias: {
      '$lib': './src/lib',
      '$app': './node_modules/@sveltejs/kit/src/runtime/app'
    }
  }
});