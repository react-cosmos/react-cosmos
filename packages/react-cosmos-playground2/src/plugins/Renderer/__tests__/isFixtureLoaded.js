// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { mockFixtures } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function getRendererState(fixtureState) {
  return {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': {
        fixtures: mockFixtures,
        fixtureState
      }
    }
  };
}

it('returns false on missing fixture', async () => {
  register();
  loadPlugins({ state: { renderer: getRendererState(null) } });

  expect(mockCall('renderer.isFixtureLoaded')).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  loadPlugins({ state: { renderer: getRendererState({}) } });

  expect(mockCall('renderer.isFixtureLoaded')).toBe(true);
});
