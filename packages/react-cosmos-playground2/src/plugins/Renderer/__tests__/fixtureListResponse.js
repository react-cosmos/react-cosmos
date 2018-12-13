// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockInitCall
} from '../../../testHelpers/plugin';
import {
  mockFixtureState,
  getFxListRes,
  getRendererState
} from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
}

function loadTestPlugins({ rendererState = null } = {}) {
  loadPlugins({ state: { renderer: rendererState } });
}

it('creates renderer state', async () => {
  registerTestPlugins();
  mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));

  loadTestPlugins();

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: null
        })
      }
    })
  );
});

it('creates multiple renderer states', async () => {
  registerTestPlugins();
  mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));
  mockInitCall('renderer.receiveResponse', getFxListRes('bar-renderer'));

  loadTestPlugins();

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: null
        }),
        'bar-renderer': expect.objectContaining({
          fixtureState: null
        })
      }
    })
  );
});

it('creates renderer state with fixture state of primary renderer', async () => {
  registerTestPlugins();
  mockInitCall('renderer.receiveResponse', getFxListRes('bar-renderer'));

  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: mockFixtureState
        })
      }
    }
  });

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: expect.objectContaining({
        'bar-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        })
      })
    })
  );
});
