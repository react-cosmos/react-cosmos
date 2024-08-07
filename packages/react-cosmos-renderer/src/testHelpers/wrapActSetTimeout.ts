import { act } from 'react';

export function wrapActSetTimeout() {
  const { setTimeout } = window;

  // @ts-ignore
  window.setTimeout = (cb: () => void, timeout: number) => {
    return setTimeout(() => {
      act(() => {
        cb();
      });
    }, timeout);
  };
}
