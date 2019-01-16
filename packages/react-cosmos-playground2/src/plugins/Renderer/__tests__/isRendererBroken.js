// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function getRendererState(status) {
  return {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': {
        status,
        fixtures: [],
        fixtureState: null
      }
    }
  };
}

it('returns false', async () => {
  register();
  loadPlugins({ state: { renderer: getRendererState('ok') } });

  expect(mockCall('renderer.isRendererBroken', 'foo-renderer')).toBe(false);
});

it('returns true', async () => {
  register();
  loadPlugins({ state: { renderer: getRendererState('error') } });

  expect(mockCall('renderer.isRendererBroken', 'foo-renderer')).toBe(true);
});
