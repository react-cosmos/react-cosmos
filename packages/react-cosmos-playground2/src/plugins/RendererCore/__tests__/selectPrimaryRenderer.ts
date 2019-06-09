import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  getRendererCoreMethods,
  mockRouter,
  mockNotifications
} from '../../../testHelpers/pluginMocks';
import { mockRendererReady } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const fixtures = {};

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
  getRendererCoreMethods().selectPrimaryRenderer('mockRendererId2');
}

it('sets primary renderer ID in state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  await wait(() =>
    expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
      'mockRendererId2'
    )
  );
});
