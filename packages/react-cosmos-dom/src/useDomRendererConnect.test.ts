// @vitest-environment jsdom
import { createDomRendererConnect } from './useDomRendererConnect.js';

class MockWebSocket {
  static instances: string[] = [];
  constructor(url: string) {
    MockWebSocket.instances.push(url);
  }
  addEventListener() {}
}

beforeEach(() => {
  MockWebSocket.instances = [];
  vi.stubGlobal('WebSocket', MockWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it('connects to web socket', () => {
  createDomRendererConnect('ws://localhost:5000', false);
  expect(MockWebSocket.instances).toEqual(['ws://localhost:5000']);
});

it('does not connect to web socket when detached', () => {
  createDomRendererConnect('ws://localhost:5000', true);
  expect(MockWebSocket.instances).toEqual([]);
});
