import './mockSocketIo';
import { ConnectMockApi } from './shared';
import { mockPostMessage } from './postMessage';
import { mockWebSockets } from './webSockets';
export { mount } from './mount';

type ConnectMock = (
  cb: (children: ConnectMockApi) => Promise<unknown>
) => Promise<void>;

export function runTests(tests: (mockConnect: ConnectMock) => void) {
  tests(mockPostMessage);
  tests(mockWebSockets);
}
