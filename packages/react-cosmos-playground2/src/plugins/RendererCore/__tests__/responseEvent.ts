import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRouter,
  mockNotifications,
  getRendererCoreMethods,
  onRendererCore
} from '../../../testHelpers/pluginMocks';
import { createRendererReadyResponse } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const rendererId = 'mockRendererId1';
const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };
const rendererReadyMsg = createRendererReadyResponse(rendererId, fixtures);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockNotifications({
    pushTimedNotification: () => {}
  });
}

it('emits response event', async () => {
  registerTestPlugins();

  const response = jest.fn();
  onRendererCore({ response });

  loadPlugins();
  getRendererCoreMethods().receiveResponse(rendererReadyMsg);

  await wait(() =>
    expect(response).toBeCalledWith(expect.any(Object), rendererReadyMsg)
  );
});
