import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { FixtureList } from 'react-cosmos-core/fixture';
import {
  getRendererCoreMethods,
  mockNotifications,
  mockRouter,
  onRendererCore,
} from '../../../testHelpers/pluginMocks';
import { register } from '..';
import { createRendererReadyResponse } from '../testHelpers';

beforeEach(register);

afterEach(resetPlugins);

const rendererId = 'mockRendererId1';
const fixtures: FixtureList = {
  'ein.js': { type: 'single' },
  'zwei.js': { type: 'single' },
  'drei.js': { type: 'single' },
};
const rendererReadyMsg = createRendererReadyResponse(rendererId, fixtures);

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
