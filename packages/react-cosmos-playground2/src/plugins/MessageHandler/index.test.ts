// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockSocketIo } from './testHelpers/mockSocketIo';

import { wait } from '@testing-library/react';
import {
  BuildErrorMessage,
  SERVER_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/build';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '.';
import {
  getMessageHandlerMethods,
  mockCore,
  onMessageHandler
} from '../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockCore({
    isDevServerOn: () => true
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
      fixtureState: {}
    }
  };
  const messageHandler = getMessageHandlerMethods();
  messageHandler.postRendererRequest(selectFixtureReq);

  await mockSocketIo(async ({ emit }) => {
    await wait(() =>
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
        fixtures: { 'ein.js': null, 'zwei.js': null, 'drei.js': null }
      }
    };

    const { rendererResponse } = onMessageHandler();
    fakeEvent(RENDERER_MESSAGE_EVENT_NAME, rendererReadyRes);

    await wait(() =>
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
      type: 'buildError'
    };

    const { serverMessage } = onMessageHandler();
    fakeEvent(SERVER_MESSAGE_EVENT_NAME, buildErrorMsg);

    await wait(() =>
      expect(serverMessage).toBeCalledWith(expect.any(Object), buildErrorMsg)
    );
  });
});
