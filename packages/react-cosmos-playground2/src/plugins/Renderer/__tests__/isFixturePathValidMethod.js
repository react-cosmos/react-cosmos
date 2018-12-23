// @flow

import { loadPlugins } from 'react-plugin';
import { cleanup, mockInitCall } from '../../../testHelpers/plugin';
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
  const callReturn = mockInitCall(
    'renderer.isFixturePathValid',
    'fixtures/sechs.js'
  );

  loadPlugins({ state: { renderer: initialRendererState } });
  expect(await callReturn).toBe(false);
});

it('returns true on existing fixture', async () => {
  register();
  const callReturn = mockInitCall(
    'renderer.isFixturePathValid',
    'fixtures/drei.js'
  );

  loadPlugins({ state: { renderer: initialRendererState } });
  expect(await callReturn).toBe(true);
});
