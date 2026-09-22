import type { RendererRequest } from 'react-cosmos-core';
import { createNoopRendererConnect } from '../createNoopRendererConnect.js';
import { createWebSocketsConnect } from '../createWebSocketsConnect.js';

const request: RendererRequest = {
  type: 'selectFixture',
  payload: {
    rendererId: 'mockRendererId',
    fixtureId: { path: 'mockFixturePath' },
    fixtureState: {},
  },
};

beforeEach(() => {
  delete window.cosmosRendererRequest;
});

describe('noop renderer connect', () => {
  it('forwards window requests to subscribed handler', () => {
    const handler = vi.fn();
    createNoopRendererConnect().onMessage(handler);

    window.cosmosRendererRequest!(request);
    expect(handler).toHaveBeenCalledWith(request);
  });

  it('forwards window requests to multiple subscribers', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const connect = createNoopRendererConnect();
    connect.onMessage(handler1);
    connect.onMessage(handler2);

    window.cosmosRendererRequest!(request);
    expect(handler1).toHaveBeenCalledWith(request);
    expect(handler2).toHaveBeenCalledWith(request);
  });

  it('stops forwarding window requests after unsubscribing', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const connect = createNoopRendererConnect();
    const unsubscribe1 = connect.onMessage(handler1);
    connect.onMessage(handler2);

    unsubscribe1();
    window.cosmosRendererRequest!(request);
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledWith(request);
  });

  it('defines window global once', () => {
    const connect = createNoopRendererConnect();
    connect.onMessage(() => {});
    const global1 = window.cosmosRendererRequest;
    connect.onMessage(() => {});
    const global2 = window.cosmosRendererRequest;

    expect(global1).toBeDefined();
    expect(global2).toBe(global1);
  });
});

describe('web sockets renderer connect', () => {
  class MockWebSocket extends EventTarget {
    static OPEN = 1;
    readyState = 0;
    send = vi.fn();
  }

  beforeEach(() => {
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('forwards window requests to subscribed handler', () => {
    const handler = vi.fn();
    createWebSocketsConnect('ws://localhost:5000').onMessage(handler);

    window.cosmosRendererRequest!(request);
    expect(handler).toHaveBeenCalledWith(request);
  });

  it('stops forwarding window requests after unsubscribing', () => {
    const handler = vi.fn();
    const unsubscribe = createWebSocketsConnect(
      'ws://localhost:5000'
    ).onMessage(handler);

    unsubscribe();
    window.cosmosRendererRequest!(request);
    expect(handler).not.toHaveBeenCalled();
  });
});
