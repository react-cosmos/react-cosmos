import { waitFor } from '@testing-library/dom';
import { RendererReadyResponse, SelectFixtureRequest } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getMessageHandlerContext,
  getRendererCoreContext,
  mockCore,
  mockMessageHandler,
  mockRendererCore,
} from '../../../testHelpers/pluginMocks.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore({
    isDevServerOn: () => true,
  });
}

it('sends renderer request to message handler', async () => {
  registerTestPlugins();
  mockRendererCore();
  const { postRendererRequest } = mockMessageHandler();

  loadPlugins();

  const selectFixtureReq: SelectFixtureRequest = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixtureId: { path: 'mockFixturePath' },
      fixtureState: {},
    },
  };
  getRendererCoreContext().emit('request', selectFixtureReq);

  await waitFor(() =>
    expect(postRendererRequest).toBeCalledWith(
      expect.any(Object),
      selectFixtureReq
    )
  );
});

it('sends renderer response to renderer core', async () => {
  registerTestPlugins();
  mockMessageHandler();
  const { receiveResponse } = mockRendererCore();

  loadPlugins();

  const rendererReadyRes: RendererReadyResponse = {
    type: 'rendererReady',
    payload: {
      rendererId: 'mockRendererId',
    },
  };
  getMessageHandlerContext().emit('rendererResponse', rendererReadyRes);

  await waitFor(() =>
    expect(receiveResponse).toBeCalledWith(expect.any(Object), rendererReadyRes)
  );
});

it('posts "pingRenderers" renderer request on load', async () => {
  registerTestPlugins();
  const { postRendererRequest } = mockMessageHandler();

  loadPlugins();

  await waitFor(() =>
    expect(postRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'pingRenderers',
    })
  );
});
