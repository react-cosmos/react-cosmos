// @flow

import { wait } from 'react-testing-library';
import {
  resetPlugins,
  registerPlugin,
  loadPlugins,
  onStateChange,
  getPluginContext
} from 'react-plugin';
import { mockFixtures, mockFixtureState } from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

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

it('resets fixture state for all renderers', async () => {
  let rendererState;

  loadTestPlugins(() => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod('renderer.unselectFixture');
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

it('posts "unselectFixture" renderer requests', async () => {
  const handleRendererRequest = jest.fn();

  loadTestPlugins(() => {
    const { init, on } = registerPlugin({ name: 'test' });
    on('renderer.request', handleRendererRequest);
    init(({ callMethod }) => {
      callMethod('renderer.unselectFixture');
    });
  });

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

function loadTestPlugins(extraSetup = () => {}) {
  register();
  extraSetup();
  loadPlugins({
    state: {
      renderer: initialRendererState
    }
  });
}
