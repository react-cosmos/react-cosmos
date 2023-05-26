import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../testHelpers/pluginMocks.js';
import { createRendererReadyResponse } from '../testHelpers/index.js';

beforeEach(register);

afterEach(resetPlugins);

const rendererId = 'mockRendererId1';
const rendererReadyMsg = createRendererReadyResponse(rendererId);

function registerTestPlugins() {
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockNotifications();
}

it('emits response event', async () => {
  registerTestPlugins();
  const { response } = onRendererCore();

  loadPlugins();
  getRendererCoreMethods().receiveResponse(rendererReadyMsg);

  await waitFor(() =>
    expect(response).toBeCalledWith(expect.any(Object), rendererReadyMsg)
  );
});
