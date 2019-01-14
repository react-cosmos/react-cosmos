// @flow

// NOTE: webSockets MUST be imported before postMessage, otherwise
// "socket.io-client" will fail to be mocked because the real module will be
// imported before the mock module
import { mockConnect as mockWebSockets } from './webSockets';
import { mockConnect as mockPostMessage } from './postMessage';
export { mount } from './mount';

import type { ConnectMockApi } from './shared';

type ConnectMock = (
  (children: ConnectMockApi) => Promise<mixed>
) => Promise<void>;

export function runTests(tests: (mockConnect: ConnectMock) => void) {
  tests(mockPostMessage);
  tests(mockWebSockets);
}
