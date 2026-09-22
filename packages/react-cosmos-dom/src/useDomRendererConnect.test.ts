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
  delete window.cosmosRendererRequest;
  vi.stubGlobal('WebSocket', MockWebSocket);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it('connects to web socket', () => {
  createDomRendererConnect({ webSocketUrl: 'ws://localhost:5000' });
  expect(MockWebSocket.instances).toEqual(['ws://localhost:5000']);
});

it('uses window hooks when detached', () => {
  const connect = createDomRendererConnect({
    webSocketUrl: 'ws://localhost:5000',
    detached: true,
  });
  onTestFinished(connect.onMessage(() => {}));
  expect(MockWebSocket.instances).toEqual([]);
  expect(window.cosmosRendererRequest).toBeDefined();
});

it('uses window hooks without web socket', () => {
  const connect = createDomRendererConnect({ webSocketUrl: null });
  onTestFinished(connect.onMessage(() => {}));
  expect(window.cosmosRendererRequest).toBeDefined();
});
