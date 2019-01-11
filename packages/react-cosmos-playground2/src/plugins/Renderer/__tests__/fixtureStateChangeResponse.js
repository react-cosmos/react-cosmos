// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockEvent,
  mockCall
} from '../../../testHelpers/plugin';
import {
  mockFixtureState,
  getRendererState,
  getFxStateChangeReq
} from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: { fixturePath: 'fixtures/zwei.js' } });
}

function loadTestPlugins({ rendererState = null } = {}) {
  loadPlugins({ state: { renderer: rendererState } });
}

it('sets "fixtureState" renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: null
        })
      }
    }
  });

  mockCall('renderer.receiveResponse', getFxStateChangeReq('foo-renderer'));

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        })
      }
    })
  );
});

it('sets primary and secondary "fixtureState" renderer states', async () => {
  registerTestPlugins();
  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: null
        }),
        'bar-renderer': getRendererState({
          fixtureState: null
        })
      }
    }
  });

  mockCall('renderer.receiveResponse', getFxStateChangeReq('foo-renderer'));

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        }),
        'bar-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        })
      }
    })
  );
});

it('only sets secondary "fixtureState" renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: null
        }),
        'bar-renderer': getRendererState({
          fixtureState: null
        })
      }
    }
  });

  mockCall('renderer.receiveResponse', getFxStateChangeReq('bar-renderer'));

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': expect.objectContaining({
          fixtureState: null
        }),
        'bar-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        })
      }
    })
  );
});

it('posts "setFixtureState" request to secondary renderer', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins({
    rendererState: {
      primaryRendererId: 'foo-renderer',
      renderers: {
        'foo-renderer': getRendererState({
          fixtureState: null
        }),
        'bar-renderer': getRendererState({
          fixtureState: null
        })
      }
    }
  });

  mockCall('renderer.receiveResponse', getFxStateChangeReq('foo-renderer'));

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'setFixtureState',
      payload: {
        rendererId: 'bar-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: mockFixtureState
      }
    })
  );
});
