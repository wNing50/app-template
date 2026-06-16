import { describe, expect, it } from 'vitest';
import { routes } from '../router';

describe('admin routes', () => {
  it('keeps the starter admin pages registered', () => {
    expect(routes.map((route) => route.name)).toEqual(['dashboard', 'settings', 'login']);
  });
});
