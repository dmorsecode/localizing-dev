import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Header from '$lib/components/layout/header.svelte';

describe('Header Component', () => {
  it('should render the site title', () => {
    render(Header, { props: { user: null } });
    expect(screen.getByText('localizing.dev')).toBeTruthy();
  });

  it('should render navigation links', () => {
    render(Header, { props: { user: null } });
    expect(screen.getByText('FAQ')).toBeTruthy();
    expect(screen.getByText('About Us')).toBeTruthy();
    expect(screen.getByText('Leaderboard')).toBeTruthy();
    expect(screen.getByText('Repositories')).toBeTruthy();
  });

  it('should show login link when user is not logged in', () => {
    render(Header, { props: { user: null } });
    expect(screen.getByText('Login')).toBeTruthy();
  });

  it('should show user avatar when user is logged in', () => {
    const mockUser = {
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg'
    };
    render(Header, { props: { user: mockUser } });
    expect(screen.getByAltText('testuser')).toBeTruthy();
  });
}); 