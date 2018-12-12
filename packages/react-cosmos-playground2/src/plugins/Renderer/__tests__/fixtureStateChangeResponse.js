// @flow

import { wait } from 'react-testing-library';
import { onStateChange, getPluginContext } from 'ui-plugin';
import { resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import {
  mockFixtureState,
  getRendererState,
  getFixtureStateChangeReq
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
  let rendererState;

  loadTestPlugins(initialRendererState, () => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod(
        'renderer.receiveResponse',
        getFixtureStateChangeReq('foo-renderer')
      );
    });
    onStateChange(() => {
      rendererState = getPluginContext('renderer').getState();
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
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
  let rendererState;

  loadTestPlugins(initialRendererState, () => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod(
        'renderer.receiveResponse',
        getFixtureStateChangeReq('foo-renderer')
      );
    });
    onStateChange(() => {
      rendererState = getPluginContext('renderer').getState();
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
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
  let rendererState;

  loadTestPlugins(initialRendererState, () => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod(
        'renderer.receiveResponse',
        getFixtureStateChangeReq('bar-renderer')
      );
    });
    onStateChange(() => {
      rendererState = getPluginContext('renderer').getState();
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
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
    const { init, on } = registerPlugin({ name: 'test' });
    on('renderer.request', handleRendererRequest);
    init(({ callMethod }) => {
      callMethod(
        'renderer.receiveResponse',
        getFixtureStateChangeReq('foo-renderer')
      );
    });
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
