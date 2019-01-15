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

function loadTestPlugins() {
  loadPlugins({
    state: {
      renderer: {
        primaryRendererId: 'foo-renderer',
        renderers: {
          'foo-renderer': {
            fixtures: mockFixtures,
            fixtureState: null,
            runtimeError: false
          }
        }
      }
    }
  });
}

it('sets runtime error flag in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockCall('renderer.receiveResponse', {
    type: 'runtimeError',
    payload: { rendererId: 'foo-renderer' }
  });

  await wait(() => {
    const { renderers } = getPluginState('renderer');
    expect(renderers['foo-renderer'].runtimeError).toBe(true);
  });
});
