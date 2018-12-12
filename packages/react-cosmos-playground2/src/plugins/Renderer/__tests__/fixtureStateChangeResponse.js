// @flow

import { wait } from 'react-testing-library';
import { resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import {
  getPluginState,
  mockEvent,
  mockInitCall
} from '../../../testHelpers/plugin';
import {
  mockFixtureState,
  getRendererState,
  getFxStateChangeReq
} from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

it('sets "fixtureState" renderer state', async () => {
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: null
      })
    }
  };

  loadTestPlugins(initialRendererState, () => {
    mockInitCall(
      'renderer.receiveResponse',
      getFxStateChangeReq('foo-renderer')
    );
  });

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
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: null
      }),
      'bar-renderer': getRendererState({
        fixtureState: null
      })
    }
  };

  loadTestPlugins(initialRendererState, () => {
    mockInitCall(
      'renderer.receiveResponse',
      getFxStateChangeReq('foo-renderer')
    );
  });

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
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: null
      }),
      'bar-renderer': getRendererState({
        fixtureState: null
      })
    }
  };

  loadTestPlugins(initialRendererState, () => {
    mockInitCall(
      'renderer.receiveResponse',
      getFxStateChangeReq('bar-renderer')
    );
  });

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
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: null
      }),
      'bar-renderer': getRendererState({
        fixtureState: null
      })
    }
  };
  const handleRendererRequest = jest.fn();

  loadTestPlugins(initialRendererState, () => {
    mockEvent('renderer.request', handleRendererRequest);
    mockInitCall(
      'renderer.receiveResponse',
      getFxStateChangeReq('foo-renderer')
    );
  });

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

function loadTestPlugins(initialState, extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'router', initialState: { urlParams: {} } });
  extraSetup();
  loadPlugins({
    state: {
      router: { urlParams: { fixturePath: 'fixtures/zwei.js' } },
      renderer: initialState
    }
  });
}
