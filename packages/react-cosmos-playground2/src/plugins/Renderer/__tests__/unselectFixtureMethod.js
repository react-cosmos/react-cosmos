// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockEvent,
  mockInitCall
} from '../../../testHelpers/plugin';
import { mockFixtures, mockFixtureState } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const initialRendererState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    },
    'bar-renderer': {
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    }
  }
};

function registerTestPlugins() {
  register();
  mockInitCall('renderer.unselectFixture');
}

function loadTestPlugins() {
  loadPlugins({ state: { renderer: initialRendererState } });
}

it('resets fixture state for all renderers', async () => {
  registerTestPlugins();
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

it('posts "unselectFixture" renderer requests', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'foo-renderer'
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'unselectFixture',
      payload: {
        rendererId: 'bar-renderer'
      }
    })
  );
});
