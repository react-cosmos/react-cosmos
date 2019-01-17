// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockCall
} from '../../../../testHelpers/plugin';
import { createFixtureListUpdateResponse } from '../../testHelpers';
import { register } from '../..';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererCoordinatorState } from '../..';

afterEach(cleanup);

const fixtures = ['ein.js', 'zwei.js', 'drei.js'];
const rendererState: RendererCoordinatorState = {
  connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
  primaryRendererId: 'mockRendererId1',
  fixtures: ['ein.js', 'zwei.js', 'drei.js'],
  fixtureState: null
};

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
}

function loadTestPlugins() {
  loadPlugins({ state: { renderer: rendererState } });
}

function mockFixtureListUpdateResponse(rendererId: RendererId) {
  mockCall(
    'renderer.receiveResponse',
    createFixtureListUpdateResponse(rendererId, [...fixtures, 'vier.js'])
  );
}

it('updates fixtures in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureListUpdateResponse('mockRendererId1');

  await wait(() =>
    expect(getPluginState('renderer').fixtures).toEqual([
      ...fixtures,
      'vier.js'
    ])
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureListUpdateResponse('mockRendererId2');

  await wait(() =>
    expect(getPluginState('renderer').fixtures).toEqual(fixtures)
  );
});
