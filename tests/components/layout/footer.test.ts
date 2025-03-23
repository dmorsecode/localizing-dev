import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Footer from '$lib/components/layout/footer.svelte';
import { renderWithProps } from '../test-utils';

describe('Footer Component', () => {
  it('should render the copyright text', () => {
    renderWithProps(Footer);
    expect(screen.getByText(/Copyright 2024 localizing.dev/)).toBeTruthy();
  });

  it('should have the correct styling classes', () => {
    const { container } = renderWithProps(Footer);
    const footer = container.querySelector('footer');
    expect(footer?.classList.contains('bottom-0')).toBe(true);
    expect(footer?.classList.contains('w-full')).toBe(true);
    expect(footer?.classList.contains('bg-white')).toBe(true);
    expect(footer?.classList.contains('border-t')).toBe(true);
  });
}); 