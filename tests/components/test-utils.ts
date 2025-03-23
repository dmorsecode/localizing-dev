/// <reference types="vitest" />
import { render } from '@testing-library/svelte';
import type { RenderResult } from '@testing-library/svelte';
import type { SvelteComponent } from 'svelte';
import { vi } from 'vitest';

// Common mock data
export const mockUser = {
  username: 'testuser',
  avatar: 'https://example.com/avatar.jpg'
};

// Helper to render components with common props
export function renderWithProps<T extends SvelteComponent>(Component: new (...args: any[]) => T, props: any = {}): RenderResult<T> {
  return render(Component, { props });
}

// Add custom matchers or other test utilities as needed
export const mockNavigate = vi.fn();
vi.mock('$app/navigation', () => ({
  goto: mockNavigate
})); 