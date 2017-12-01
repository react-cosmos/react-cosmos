// @flow

import type { JestMock } from './types';

export function getMock(fn: any): JestMock {
  return fn.mock;
}
