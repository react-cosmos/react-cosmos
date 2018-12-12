// @flow

import { wait } from 'react-testing-library';
import { onStateChange, getPluginContext } from 'ui-plugin';
import { resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import {
  mockFixtureState,
  getFixtureListRes,
  getRendererState
} from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

it('creates renderer state', async () => {
  let rendererState;

  loadTestPlugins(null, () => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod('renderer.receiveResponse', getFixtureListRes('foo-renderer'));
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
        })
      }
    })
  );
});

it('creates multiple renderer states', async () => {
  let rendererState;

  loadTestPlugins(null, () => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod('renderer.receiveResponse', getFixtureListRes('foo-renderer'));
      callMethod('renderer.receiveResponse', getFixtureListRes('bar-renderer'));
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
          fixtureState: null
        })
      }
    })
  );
});

it('creates renderer state with fixture state of primary renderer', async () => {
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: mockFixtureState
      })
    }
  };
  let rendererState;

  loadTestPlugins(initialRendererState, () => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod('renderer.receiveResponse', getFixtureListRes('bar-renderer'));
    });
    onStateChange(() => {
      rendererState = getPluginContext('renderer').getState();
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
      primaryRendererId: 'foo-renderer',
      renderers: expect.objectContaining({
        'bar-renderer': expect.objectContaining({
          fixtureState: mockFixtureState
        })
      })
    })
  );
});

function loadTestPlugins(initialState, extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'router', initialState: { urlParams: {} } });
  extraSetup();
  loadPlugins({
    state: {
      renderer: initialState
    }
  });
}
