// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockCall
} from '../../../testHelpers/plugin';
import { mockFixtures, getFxListChangeRes } from '../testHelpers';
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
            fixtureState: null
          }
        }
      }
    }
  });
}

it('updates fixture list in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockCall(
    'renderer.receiveResponse',
    getFxListChangeRes('foo-renderer', [...mockFixtures, 'fixtures/vier.js'])
  );

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtures: [
            'fixtures/ein.js',
            'fixtures/zwei.js',
            'fixtures/drei.js',
            'fixtures/vier.js'
          ]
        })
      }
    })
  );
});
