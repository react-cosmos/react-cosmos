// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  cleanup,
  mockState,
  mockEvent,
  mockCall
} from '../../../../testHelpers/plugin';
import { createRendererReadyResponse } from '../../testHelpers';
import { register } from '../..';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RendererCoordinatorState } from '../..';

afterEach(cleanup);

const fixturePath = 'ein.js';
const fixtures = [fixturePath];
const fixtureState = { components: [] };

function registerTestPlugins(handleRendererRequest) {
  register();
  mockState('router', { urlParams: { fixturePath } });
  mockEvent('rendererCoordinator.request', handleRendererRequest);
}

function loadTestPlugins(state?: RendererCoordinatorState) {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  mockCall(
    'rendererCoordinator.receiveResponse',
    createRendererReadyResponse(rendererId, fixtures)
  );
}

it('posts "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);

  loadTestPlugins();
  mockRendererReadyResponse('mockRendererId');

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixturePath,
        fixtureState: null
      }
    })
  );
});

it('posts "selectFixture" renderer request with fixture state', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);

  loadTestPlugins({
    connectedRendererIds: ['mockRendererId1'],
    primaryRendererId: 'mockRendererId1',
    fixtures,
    fixtureState
  });
  mockRendererReadyResponse('mockRendererId2');

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixturePath,
        fixtureState
      }
    })
  );
});
