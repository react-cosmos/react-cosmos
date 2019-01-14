// @flow

import { mockConnect as mockPostMessage } from './postMessage';
import { mockConnect as mockWebSockets } from './webSockets';
export { mount } from './mount';

import type { ConnectMockApi } from './shared';

type ConnectMock = (
  (children: ConnectMockApi) => Promise<mixed>
) => Promise<void>;

export function runTests(tests: (mockConnect: ConnectMock) => void) {
  tests(mockPostMessage);
  tests(mockWebSockets);
}
