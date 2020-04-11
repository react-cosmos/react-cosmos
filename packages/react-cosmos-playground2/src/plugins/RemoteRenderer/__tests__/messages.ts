import { loadPlugins, resetPlugins } from 'react-plugin';
import { waitFor } from '@testing-library/dom';
import {
  SelectFixtureRequest,
  RendererReadyResponse
} from 'react-cosmos-shared2/renderer';
import {
  mockCore,
  mockRendererCore,
  mockMessageHandler,
  getMessageHandlerContext,
  getRendererCoreContext
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockCore({
    isDevServerOn: () => true
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
      fixtureId: { path: 'mockFixturePath', name: null },
      fixtureState: {}
    }
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
      fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null }
    }
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
      type: 'pingRenderers'
    })
  );
});
