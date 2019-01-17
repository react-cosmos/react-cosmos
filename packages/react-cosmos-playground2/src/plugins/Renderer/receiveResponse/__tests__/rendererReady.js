// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockState,
  mockCall
} from '../../../../testHelpers/plugin';
import { createRendererReadyResponse } from '../../testHelpers';
import { register } from '../..';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererCoordinatorState } from '../..';

afterEach(cleanup);

const fixtures = ['ein.js'];
const fixtureState = { components: [] };

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
}

function loadTestPlugins(rendererState?: RendererCoordinatorState) {
  loadPlugins({ state: { renderer: rendererState } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  mockCall(
    'renderer.receiveResponse',
    createRendererReadyResponse(rendererId, fixtures)
  );
}

it('creates renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockRendererReadyResponse('mockRendererId1');

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      connectedRendererIds: ['mockRendererId1'],
      primaryRendererId: 'mockRendererId1',
      fixtures,
      fixtureState: null
    })
  );
});

it('creates multi-renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockRendererReadyResponse('mockRendererId1');
  mockRendererReadyResponse('mockRendererId2');

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
      primaryRendererId: 'mockRendererId1',
      fixtures,
      fixtureState: null
    })
  );
});

it('keeps fixtures state when secondary renderer connects', async () => {
  registerTestPlugins();
  loadTestPlugins({
    connectedRendererIds: ['mockRendererId1'],
    primaryRendererId: 'mockRendererId1',
    fixtures,
    fixtureState
  });

  mockRendererReadyResponse('mockRendererId2');

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
      primaryRendererId: 'mockRendererId1',
      fixtures,
      fixtureState
    })
  );
});

it('resets fixtures state when primary renderer re-connects', async () => {
  registerTestPlugins();
  loadTestPlugins({
    connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
    primaryRendererId: 'mockRendererId1',
    fixtures,
    fixtureState
  });

  mockRendererReadyResponse('mockRendererId1');

  await wait(() =>
    expect(getPluginState('renderer')).toEqual({
      connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
      primaryRendererId: 'mockRendererId1',
      fixtures,
      fixtureState: null
    })
  );
});
