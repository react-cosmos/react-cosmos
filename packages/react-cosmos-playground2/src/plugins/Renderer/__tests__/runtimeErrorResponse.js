// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockCall
} from '../../../testHelpers/plugin';
import { mockFixtures } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
}

function loadTestPlugins(rendererState) {
  loadPlugins({
    state: {
      renderer: rendererState
    }
  });
}

it('sets error status in existing renderer state', async () => {
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

  mockCall('renderer.receiveResponse', {
    type: 'runtimeError',
    payload: { rendererId: 'foo-renderer' }
  });

  await wait(() => {
    const { renderers } = getPluginState('renderer');
    expect(renderers['foo-renderer'].status).toBe('error');
  });
});

it('creates renderer state with error status', async () => {
  registerTestPlugins();
  loadTestPlugins({
    primaryRendererId: null,
    renderers: {}
  });

  mockCall('renderer.receiveResponse', {
    type: 'runtimeError',
    payload: { rendererId: 'foo-renderer' }
  });

  await wait(() => {
    const { renderers } = getPluginState('renderer');
    expect(renderers['foo-renderer'].status).toBe('error');
  });
});
