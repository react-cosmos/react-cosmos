import { create } from 'react-test-renderer';
import { ReactTestRenderer } from 'react-test-renderer';
import * as React from 'react';

export async function mount(
  element: React.ReactElement<any>,
  children: (renderer: ReactTestRenderer) => Promise<unknown>
) {
  expect.hasAssertions();
  const renderer = create(element);
  try {
    await children(renderer);
  } finally {
    renderer.unmount();
  }
}
