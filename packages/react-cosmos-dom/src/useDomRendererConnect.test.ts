// @vitest-environment jsdom
import { createDomRendererConnect } from './useDomRendererConnect.js';

class MockWebSocket {
  static instances: string[] = [];
  constructor(url: string) {
    MockWebSocket.instances.push(url);
  }
  addEventListener() {}
  removeEventListener() {}
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

it('does not expose window request hook when connected to web socket', () => {
  delete window.cosmosRendererRequest;
  createDomRendererConnect('ws://localhost:5000', false).onMessage(() => {});
  expect(window.cosmosRendererRequest).toBeUndefined();
});

it('exposes window request hook when detached', () => {
  delete window.cosmosRendererRequest;
  const handler = vi.fn();
  createDomRendererConnect('ws://localhost:5000', true).onMessage(handler);
  window.cosmosRendererRequest!({
    type: 'unselectFixture',
    payload: { rendererId: 'mockRendererId' },
  });
  expect(handler).toHaveBeenCalled();
});

it('exposes window request hook without web socket', () => {
  delete window.cosmosRendererRequest;
  createDomRendererConnect(null, false).onMessage(() => {});
  expect(window.cosmosRendererRequest).toBeDefined();
});
