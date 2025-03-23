import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { readable } from 'svelte/store';

// Mock SvelteKit's app navigation
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn()
}));

// Mock SvelteKit's environment variables
vi.mock('$env/dynamic/public', () => ({
  env: {}
}));

// Mock SvelteKit's page store
vi.mock('$app/stores', () => ({
  page: readable({
    url: new URL('http://localhost'),
    params: {},
    route: { id: null },
    status: 200,
    error: null,
    data: {}
  })
})); 