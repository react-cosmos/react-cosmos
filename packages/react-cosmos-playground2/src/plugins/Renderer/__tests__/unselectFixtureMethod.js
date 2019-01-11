// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockEvent,
  mockCall
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

function loadTestPlugins() {
  loadPlugins({ state: { renderer: initialRendererState } });
  mockCall('renderer.unselectFixture');
}

it('resets fixture state for all renderers', async () => {
  register();
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
  register();

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
