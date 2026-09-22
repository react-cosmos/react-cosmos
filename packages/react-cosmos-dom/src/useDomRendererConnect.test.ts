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
  createDomRendererConnect({
    webSocketUrl: 'ws://localhost:5000',
    detached: true,
  }).onMessage(() => {});
  expect(MockWebSocket.instances).toEqual([]);
  expect(window.cosmosRendererRequest).toBeDefined();
});

it('uses window hooks without web socket', () => {
  createDomRendererConnect({ webSocketUrl: null }).onMessage(() => {});
  expect(window.cosmosRendererRequest).toBeDefined();
});
