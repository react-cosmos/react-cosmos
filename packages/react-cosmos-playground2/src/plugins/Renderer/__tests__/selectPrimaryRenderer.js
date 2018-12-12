// @flow

import { wait } from 'react-testing-library';
import { resetPlugins, loadPlugins } from 'react-plugin';
import { getPluginState, mockInitCall } from '../../../testHelpers/plugin';
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
  loadTestPlugins(() => {
    mockInitCall('renderer.selectPrimaryRenderer', 'bar-renderer');
  });

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
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
