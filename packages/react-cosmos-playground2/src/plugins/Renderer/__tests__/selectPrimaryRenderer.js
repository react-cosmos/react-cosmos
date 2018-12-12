// @flow

import { wait } from 'react-testing-library';
import {
  resetPlugins,
  registerPlugin,
  loadPlugins,
  onStateChange,
  getPluginContext
} from 'react-plugin';
import { mockFixtures } from '../testHelpers';
import { register } from '..';

afterEach(resetPlugins);

const initialRendererState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: mockFixtures,
      fixtureState: null
    },
    'bar-renderer': {
      fixtures: mockFixtures,
      fixtureState: null
    }
  }
};

it('sets primary renderer ID in state', async () => {
  let rendererState;

  loadTestPlugins(() => {
    const { init } = registerPlugin({ name: 'test' });
    init(({ callMethod }) => {
      callMethod('renderer.selectPrimaryRenderer', 'bar-renderer');
    });
    onStateChange(() => {
      rendererState = getPluginContext('renderer').getState();
    });
  });

  await wait(() =>
    expect(rendererState).toEqual({
      primaryRendererId: 'bar-renderer',
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

function loadTestPlugins(extraSetup = () => {}) {
  register();
  extraSetup();
  loadPlugins({
    state: {
      renderer: initialRendererState
    }
  });
}
