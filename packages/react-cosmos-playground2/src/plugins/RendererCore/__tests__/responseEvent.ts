import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, on } from '../../../testHelpers/plugin';
import {
  mockRouter,
  mockNotifications
} from '../../../testHelpers/pluginMocks';
import {
  createRendererReadyResponse,
  getRendererCoreMethods
} from '../testHelpers';
import { RendererCoreSpec } from '../public';
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
  on<RendererCoreSpec>('rendererCore', { response });

  loadPlugins();
  getRendererCoreMethods().receiveResponse(rendererReadyMsg);

  await wait(() =>
    expect(response).toBeCalledWith(expect.any(Object), rendererReadyMsg)
  );
});
