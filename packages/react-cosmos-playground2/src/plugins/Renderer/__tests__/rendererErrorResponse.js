// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockCall
} from '../../../testHelpers/plugin';
import { mockFixtures, getErrorRes } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
}

function loadTestPlugins(rendererState) {
  loadPlugins({ state: { renderer: rendererState } });
}

function getRendererStatus() {
  return getPluginState('renderer').renderers['foo-renderer'].status;
}

it('sets "fixtureError" status in existing renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins({
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': {
        status: 'ok',
        fixtures: mockFixtures,
        fixtureState: null
      }
    }
  });
  mockCall('renderer.receiveResponse', getErrorRes('foo-renderer'));

  await wait(() => expect(getRendererStatus()).toBe('fixtureError'));
});

it('creates renderer state with "initError" status', async () => {
  registerTestPlugins();
  loadTestPlugins({
    primaryRendererId: null,
    renderers: {}
  });
  mockCall('renderer.receiveResponse', getErrorRes('foo-renderer'));

  await wait(() => expect(getRendererStatus()).toBe('initError'));
});
