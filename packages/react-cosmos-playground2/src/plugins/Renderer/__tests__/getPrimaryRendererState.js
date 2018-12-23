// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockInitCall } from '../../../testHelpers/plugin';
import { mockFixtures, mockFixtureState } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

it('return null', async () => {
  register();
  const callReturn = mockInitCall('renderer.getPrimaryRendererState');

  loadPlugins({ state: { renderer: null } });
  expect(await callReturn).toBe(null);
});

it('return primary renderer state', async () => {
  register();
  const callReturn = mockInitCall('renderer.getPrimaryRendererState');

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
  expect(await callReturn).toEqual({
    fixtures: mockFixtures,
    fixtureState: mockFixtureState
  });
});

it('return primary renderer state', async () => {
  register();
  const callReturn = mockInitCall('renderer.getPrimaryRendererState');

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
  expect(await callReturn).toEqual({
    fixtures: mockFixtures,
    fixtureState: null
  });
});
