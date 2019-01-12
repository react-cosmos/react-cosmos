// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockState, mockCall } from '../../../testHelpers/plugin';
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

function mockFixturePath(fixturePath) {
  mockState('router', { urlParams: { fixturePath } });
}

it('returns false on missing fixture', async () => {
  register();
  mockFixturePath('fixtures/sechs.js');
  loadPlugins({ state: { renderer: initialRendererState } });

  expect(mockCall('renderer.isValidFixtureSelected')).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  mockFixturePath('fixtures/drei.js');
  loadPlugins({ state: { renderer: initialRendererState } });

  expect(mockCall('renderer.isValidFixtureSelected')).toBe(true);
});
