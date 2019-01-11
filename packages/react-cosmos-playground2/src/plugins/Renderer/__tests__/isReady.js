// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { mockFixtures } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

it('returns false on missing fixture', async () => {
  const rendererState = { primaryRendererId: null, renderers: {} };

  register();
  loadPlugins({ state: { renderer: rendererState } });

  expect(await mockCall('renderer.isReady')).toBe(false);
});

it('returns true on existing fixture', async () => {
  const rendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': {
        fixtures: mockFixtures,
        fixtureState: null
      }
    }
  };

  register();
  loadPlugins({ state: { renderer: rendererState } });

  expect(await mockCall('renderer.isReady')).toBe(true);
});
