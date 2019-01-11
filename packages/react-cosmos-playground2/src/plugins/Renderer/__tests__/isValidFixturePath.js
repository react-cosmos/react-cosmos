// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockCall } from '../../../testHelpers/plugin';
import { mockFixtures } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const initialRendererState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: mockFixtures,
      fixtureState: null
    }
  }
};

it('returns false on missing fixture', async () => {
  register();
  loadPlugins({ state: { renderer: initialRendererState } });

  const isValid = mockCall('renderer.isValidFixturePath', 'fixtures/sechs.js');
  expect(isValid).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  loadPlugins({ state: { renderer: initialRendererState } });

  const isValid = mockCall('renderer.isValidFixturePath', 'fixtures/drei.js');
  expect(isValid).toBe(true);
});
