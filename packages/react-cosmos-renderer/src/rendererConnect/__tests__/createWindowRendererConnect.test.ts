import type { RendererRequest, RendererResponse } from 'react-cosmos-core';
import { createWindowRendererConnect } from '../createWindowRendererConnect.js';

const request: RendererRequest = {
  type: 'selectFixture',
  payload: {
    rendererId: 'mockRendererId',
    fixtureId: { path: 'mockFixturePath' },
    fixtureState: {},
  },
};

const response: RendererResponse = {
  type: 'rendererReady',
  payload: { rendererId: 'mockRendererId', selectedFixtureId: null },
};

beforeEach(() => {
  delete window.cosmosRendererRequest;
  delete window.cosmosRendererResponse;
});

it('forwards window requests to message handlers', () => {
  const handler1 = vi.fn();
  const handler2 = vi.fn();
  const connect = createWindowRendererConnect();
  const unsubscribe1 = connect.onMessage(handler1);
  onTestFinished(connect.onMessage(handler2));

  window.cosmosRendererRequest!(request);
  expect(handler1).toHaveBeenCalledWith(request);
  expect(handler2).toHaveBeenCalledWith(request);

  unsubscribe1();
  window.cosmosRendererRequest!(request);
  expect(handler1).toHaveBeenCalledTimes(1);
  expect(handler2).toHaveBeenCalledTimes(2);
});

it('replaces stale window request hook', () => {
  window.cosmosRendererRequest = () => {};
  const handler = vi.fn();
  onTestFinished(createWindowRendererConnect().onMessage(handler));

  window.cosmosRendererRequest(request);
  expect(handler).toHaveBeenCalledWith(request);
});

it('forwards responses to window handler', () => {
  window.cosmosRendererResponse = vi.fn();
  createWindowRendererConnect().postMessage(response);
  expect(window.cosmosRendererResponse).toHaveBeenCalledWith(response);
});

it('posts responses without window handler', () => {
  expect(() =>
    createWindowRendererConnect().postMessage(response)
  ).not.toThrow();
});
