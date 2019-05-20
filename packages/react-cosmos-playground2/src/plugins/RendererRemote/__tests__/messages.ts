import { loadPlugins } from 'react-plugin';
import { wait } from 'react-testing-library';
import {
  SelectFixtureRequest,
  RendererReadyResponse
} from 'react-cosmos-shared2/renderer';
import { cleanup } from '../../../testHelpers/plugin';
import * as pluginMocks from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function mockCore() {
  pluginMocks.mockCore({
    isDevServerOn: () => true
  });
}

it('sends renderer request message to message handler', async () => {
  register();
  mockCore();
  pluginMocks.mockRendererCore({});

  const postRendererRequest = jest.fn();
  pluginMocks.mockMessageHandler({ postRendererRequest });

  loadPlugins();

  const selectFixtureReq: SelectFixtureRequest = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixtureId: { path: 'mockFixturePath', name: null },
      fixtureState: {}
    }
  };
  pluginMocks.getRendererCoreContext().emit('request', selectFixtureReq);

  await wait(() =>
    expect(postRendererRequest).toBeCalledWith(
      expect.any(Object),
      selectFixtureReq
    )
  );
});

it('sends renderer response to renderer core', async () => {
  register();
  mockCore();
  pluginMocks.mockMessageHandler({ postRendererRequest: () => {} });

  const receiveResponse = jest.fn();
  pluginMocks.mockRendererCore({ receiveResponse });

  loadPlugins();

  const rendererReadyRes: RendererReadyResponse = {
    type: 'rendererReady',
    payload: {
      rendererId: 'mockRendererId',
      fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null }
    }
  };
  pluginMocks
    .getMessageHandlerContext()
    .emit('rendererResponse', rendererReadyRes);

  await wait(() =>
    expect(receiveResponse).toBeCalledWith(expect.any(Object), rendererReadyRes)
  );
});

it('posts "pingRenderers" renderer request on load', async () => {
  register();
  mockCore();

  const postRendererRequest = jest.fn();
  pluginMocks.mockMessageHandler({ postRendererRequest });

  loadPlugins();

  await wait(() =>
    expect(postRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'pingRenderers'
    })
  );
});
