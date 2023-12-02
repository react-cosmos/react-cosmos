import { vi } from 'vitest';

export function mockWindowOpen() {
  const windowOpen = window.open;
  const mock = vi.fn();
  window.open = mock;
  return {
    value: mock,
    unmock: () => {
      window.open = windowOpen;
    },
  };
}
