import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import { cleanup } from '../../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications
} from '../../../../testHelpers/pluginMocks';
import {
  createFixtureListUpdateResponse,
  mockRendererReady
} from '../../testHelpers';
import { register } from '../..';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockNotifications();
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2', fixtures);
}

function mockFixtureListUpdateResponse(rendererId: RendererId) {
  const methods = getRendererCoreMethods();
  methods.receiveResponse(
    createFixtureListUpdateResponse(rendererId, {
      ...fixtures,
      'vier.js': null
    })
  );
}

it('updates fixtures in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureListUpdateResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual({
      ...fixtures,
      'vier.js': null
    })
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();
  mockFixtureListUpdateResponse('mockRendererId2');

  await wait(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
  );
});
