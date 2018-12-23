// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockInitCall
} from '../../../testHelpers/plugin';
import { mockFixtures, getReadyRes, getFxListChangeRes } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
}

function loadTestPlugins() {
  loadPlugins();
}

it('updates fixture list in renderer state', async () => {
  registerTestPlugins();
  mockInitCall('renderer.receiveResponse', getReadyRes('foo-renderer'));
  mockInitCall(
    'renderer.receiveResponse',
    getFxListChangeRes('foo-renderer', [...mockFixtures, 'fixtures/vier.js'])
  );

  loadTestPlugins();

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
