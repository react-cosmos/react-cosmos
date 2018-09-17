/* eslint-env jest */
/* istanbul ignore file */
// @flow

import { create } from 'react-test-renderer';

import type { ReactTestRenderer } from 'react-test-renderer';
import type { Element } from 'react';

export async function mount(
  element: Element<any>,
  children: (instance: ReactTestRenderer) => Promise<mixed>
) {
  expect.hasAssertions();

  const renderer = create(element);
  try {
    await children(renderer);
  } finally {
    renderer.unmount();
  }
}
