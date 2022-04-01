// NOTE: Mock files need to imported before modules that use the mocked APIs
import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  BuildErrorMessage,
  SERVER_MESSAGE_EVENT_NAME,
} from '../../../core/serverMessage';
import { RENDERER_MESSAGE_EVENT_NAME } from '../../../renderer/types';
import {
  getMessageHandlerMethods,
  mockCore,
  onMessageHandler,
} from '../../testHelpers/pluginMocks';
import { mockSocketIo } from './testHelpers/mockSocketIo';

beforeEach(() => jest.isolateModules(() => require('.')));

afterEach(resetPlugins);

function registerTestPlugins() {
  mockCore({
    isDevServerOn: () => true,
  });
}

it('emits renderer request externally', async () => {
  registerTestPlugins();
  loadPlugins();

  const selectFixtureReq = {
    type: 'selectFixture',
    payload: {
      rendererId: 'mockRendererId',
      fixtureId: { path: 'mockFixturePath', name: null },
      fixtureState: {},
    },
  };
  const messageHandler = getMessageHandlerMethods();
  messageHandler.postRendererRequest(selectFixtureReq);

  await mockSocketIo(async ({ emit }) => {
    await waitFor(() =>
      expect(emit).toBeCalledWith(RENDERER_MESSAGE_EVENT_NAME, selectFixtureReq)
    );
  });
});

it('emits renderer response internally', async () => {
  registerTestPlugins();
  loadPlugins();

  await mockSocketIo(async ({ fakeEvent }) => {
    const rendererReadyRes = {
      type: 'rendererReady',
      payload: {
        rendererId: 'mockRendererId',
        fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null },
      },
    };

    const { rendererResponse } = onMessageHandler();
    fakeEvent(RENDERER_MESSAGE_EVENT_NAME, rendererReadyRes);

    await waitFor(() =>
      expect(rendererResponse).toBeCalledWith(
        expect.any(Object),
        rendererReadyRes
      )
    );
  });
});

it('emits server message internally', async () => {
  registerTestPlugins();
  loadPlugins();

  await mockSocketIo(async ({ fakeEvent }) => {
    const buildErrorMsg: BuildErrorMessage = {
      type: 'buildError',
    };

    const { serverMessage } = onMessageHandler();
    fakeEvent(SERVER_MESSAGE_EVENT_NAME, buildErrorMsg);

    await waitFor(() =>
      expect(serverMessage).toBeCalledWith(expect.any(Object), buildErrorMsg)
    );
  });
});
