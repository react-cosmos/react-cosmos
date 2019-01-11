// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, getPluginState, mockCall } from '../../../testHelpers/plugin';
import { mockFixtures } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

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
  register();
  loadPlugins({ state: { renderer: initialRendererState } });

  mockCall('renderer.selectPrimaryRenderer', 'bar-renderer');

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
