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

it('does not connect to web socket when detached', () => {
  createDomRendererConnect({
    webSocketUrl: 'ws://localhost:5000',
    detached: true,
  });
  expect(MockWebSocket.instances).toEqual([]);
});

it('exposes window request hook when detached', () => {
  const handler = vi.fn();
  createDomRendererConnect({
    webSocketUrl: 'ws://localhost:5000',
    detached: true,
  }).onMessage(handler);
  window.cosmosRendererRequest!({
    type: 'unselectFixture',
    payload: { rendererId: 'mockRendererId' },
  });
  expect(handler).toHaveBeenCalled();
});

it('exposes window request hook without web socket', () => {
  createDomRendererConnect({}).onMessage(() => {});
  expect(window.cosmosRendererRequest).toBeDefined();
});
