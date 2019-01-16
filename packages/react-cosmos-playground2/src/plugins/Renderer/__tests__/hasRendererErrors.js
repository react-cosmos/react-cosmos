// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { register } from '..';

import type { RendererStatus } from '..';

afterEach(cleanup);

const MOCK_RENDERER_ID = 'foo-renderer';

function loadTestPlugins(status: RendererStatus) {
  const rendererState = {
    primaryRendererId: MOCK_RENDERER_ID,
    renderers: {
      [MOCK_RENDERER_ID]: {
        status,
        fixtures: [],
        fixtureState: null
      }
    }
  };
  loadPlugins({ state: { renderer: rendererState } });
}

function hasRendererErrors() {
  return mockCall('renderer.hasRendererErrors', MOCK_RENDERER_ID);
}

it('returns false on "ok" status', async () => {
  register();
  loadTestPlugins('ok');

  expect(hasRendererErrors()).toBe(false);
});

it('returns true on "initError" status', async () => {
  register();
  loadTestPlugins('initError');

  expect(hasRendererErrors()).toBe(true);
});

it('returns true on "fixtureError" status', async () => {
  register();
  loadTestPlugins('fixtureError');

  expect(hasRendererErrors()).toBe(true);
});
