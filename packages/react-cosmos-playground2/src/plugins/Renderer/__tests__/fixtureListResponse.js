// @flow

import { wait } from 'react-testing-library';
import { resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import { getPluginState, mockInitCall } from '../../../testHelpers/plugin';
import {
  mockFixtureState,
  getFxListRes,
  getRendererState
} from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

it('creates renderer state', async () => {
  loadTestPlugins(null, () => {
    mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));
  });

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
  loadTestPlugins(null, () => {
    mockInitCall('renderer.receiveResponse', getFxListRes('foo-renderer'));
    mockInitCall('renderer.receiveResponse', getFxListRes('bar-renderer'));
  });

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
  const initialRendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': getRendererState({
        fixtureState: mockFixtureState
      })
    }
  };

  loadTestPlugins(initialRendererState, () => {
    mockInitCall('renderer.receiveResponse', getFxListRes('bar-renderer'));
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
