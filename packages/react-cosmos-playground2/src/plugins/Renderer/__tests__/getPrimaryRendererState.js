// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { mockFixtures, mockFixtureState } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

it('returns null', async () => {
  register();
  loadPlugins({ state: { renderer: null } });

  expect(await mockCall('renderer.getPrimaryRendererState')).toBe(null);
});

it('returns primary renderer state', async () => {
  register();
  loadPlugins({
    state: {
      renderer: {
        primaryRendererId: 'foo-renderer',
        renderers: {
          'foo-renderer': {
            fixtures: mockFixtures,
            fixtureState: mockFixtureState
          }
        }
      }
    }
  });

  expect(await mockCall('renderer.getPrimaryRendererState')).toEqual({
    fixtures: mockFixtures,
    fixtureState: mockFixtureState
  });
});

it('returns primary renderer state', async () => {
  register();
  loadPlugins({
    state: {
      renderer: {
        primaryRendererId: 'bar-renderer',
        renderers: {
          'foo-renderer': {
            fixtures: mockFixtures,
            fixtureState: mockFixtureState
          },
          'bar-renderer': {
            fixtures: mockFixtures,
            fixtureState: null
          }
        }
      }
    }
  });

  expect(await mockCall('renderer.getPrimaryRendererState')).toEqual({
    fixtures: mockFixtures,
    fixtureState: null
  });
});
