// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

it('returns false', async () => {
  const rendererState = { primaryRendererId: null, renderers: {} };

  register();
  loadPlugins({ state: { renderer: rendererState } });

  expect(mockCall('renderer.isRendererConnected')).toBe(false);
});

it('returns true', async () => {
  const rendererState = {
    primaryRendererId: 'foo-renderer',
    renderers: {
      'foo-renderer': {
        status: 'ok',
        fixtures: [],
        fixtureState: null
      }
    }
  };

  register();
  loadPlugins({ state: { renderer: rendererState } });

  expect(mockCall('renderer.isRendererConnected')).toBe(true);
});
