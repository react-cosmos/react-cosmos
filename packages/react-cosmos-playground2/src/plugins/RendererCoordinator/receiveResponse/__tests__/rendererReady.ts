import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getState,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin2';
import { RouterSpec } from '../../../Router/public';
import { createRendererReadyResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoordinatorSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixtures = ['ein.js'];
const fixtureState = { components: [] };

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({})
  });
}

function loadTestPlugins(state?: State) {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoordinatorSpec>('rendererCoordinator');
  methods.receiveResponse(createRendererReadyResponse(rendererId, fixtures));
}

function getRendererCoordinatorState() {
  return getState<RendererCoordinatorSpec>('rendererCoordinator');
}

it('creates renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockRendererReadyResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoordinatorState()).toEqual({
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
    expect(getRendererCoordinatorState()).toEqual({
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
    expect(getRendererCoordinatorState()).toEqual({
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
    expect(getRendererCoordinatorState()).toEqual({
      connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
      primaryRendererId: 'mockRendererId1',
      fixtures,
      fixtureState: null
    })
  );
});
