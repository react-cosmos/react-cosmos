import { act } from '@testing-library/react';

const _setTimeout = window.setTimeout;

export function wrapSetTimeoutAct() {
  window.setTimeout = ((handler: () => void, timeout?: number) => {
    return _setTimeout(() => {
      act(() => {
        handler();
      });
    }, timeout);
  }) as typeof _setTimeout;
}

export function clearSetTimeoutAct() {
  window.setTimeout = _setTimeout;
}
