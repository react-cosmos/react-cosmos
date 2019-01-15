// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockCall
} from '../../../testHelpers/plugin';
import {
  mockFixtures,
  mockFixtureState,
  getReadyRes,
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
  loadTestPlugins();

  mockCall('renderer.receiveResponse', getReadyRes('foo-renderer'));

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': {
          fixtures: mockFixtures,
          fixtureState: null,
          runtimeError: false
        }
      }
    })
  );
});

it('creates multiple renderer states', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockCall('renderer.receiveResponse', getReadyRes('foo-renderer'));
  mockCall('renderer.receiveResponse', getReadyRes('bar-renderer'));

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

  mockCall('renderer.receiveResponse', getReadyRes('bar-renderer'));

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

it('resets fixture state in all renderer states', async () => {
  registerTestPlugins();
  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: mockFixtureState
        }),
        'bar-renderer': getRendererState({
          fixtureState: mockFixtureState
        })
      }
    }
  });

  mockCall('renderer.receiveResponse', getReadyRes('foo-renderer'));

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: expect.objectContaining({
        'foo-renderer': expect.objectContaining({
          fixtures: mockFixtures,
          fixtureState: null
        }),
        'bar-renderer': expect.objectContaining({
          fixtures: mockFixtures,
          fixtureState: null
        })
      })
    })
  );
});

it('clears runtime error state flag', async () => {
  registerTestPlugins();
  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          runtimeError: true
        })
      }
    }
  });

  mockCall('renderer.receiveResponse', getReadyRes('foo-renderer'));

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: expect.objectContaining({
        'foo-renderer': expect.objectContaining({
          runtimeError: false
        })
      })
    })
  );
});
