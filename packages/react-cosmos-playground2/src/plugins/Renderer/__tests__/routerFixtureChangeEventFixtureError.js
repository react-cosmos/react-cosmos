// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockPlugin,
  mockEvent,
  mockEmit,
  getPluginState
} from '../../../testHelpers/plugin';
import { mockFixtures, mockFixtureState } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const MOCK_RENDERER_ID = 'foo-renderer';

const initialRendererState = {
  primaryRendererId: MOCK_RENDERER_ID,
  renderers: {
    [MOCK_RENDERER_ID]: {
      status: 'fixtureError',
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    }
  }
};

function registerTestPlugins() {
  register();
  mockPlugin('router');
}

function loadTestPlugins() {
  loadPlugins({ state: { renderer: initialRendererState } });
}

function emitRouterFixtureChange(fixturePath) {
  mockEmit('router.fixtureChange', fixturePath);
}

function getRendererStatus() {
  return getPluginState('renderer').renderers[MOCK_RENDERER_ID].status;
}

it('resets "fixtureError" status on fixture select', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();
  emitRouterFixtureChange('fixtures/zwei.js');

  await wait(() => expect(getRendererStatus()).toBe('ok'));
});

it('resets "fixtureError" status on fixture unselect', async () => {
  registerTestPlugins();

  const handleRendererRequest = jest.fn();
  mockEvent('renderer.request', handleRendererRequest);

  loadTestPlugins();
  emitRouterFixtureChange(undefined);

  await wait(() => expect(getRendererStatus()).toBe('ok'));
});
