import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockRouter,
  mockNotifications,
  getRendererCoreMethods,
  onRendererCore,
} from '../../../testHelpers/pluginMocks';
import { createRendererReadyResponse } from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

const rendererId = 'mockRendererId1';
const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };
const rendererReadyMsg = createRendererReadyResponse(rendererId, fixtures);

function registerTestPlugins() {
  register();
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
