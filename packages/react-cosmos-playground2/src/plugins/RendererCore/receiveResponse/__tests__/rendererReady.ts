import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getState,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { createRendererReadyResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoreSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixtures = { 'ein.js': null };
const fixtureState = { components: [] };

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
}

function loadTestPlugins(state?: State) {
  loadPlugins({ state: { rendererCore: state } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(createRendererReadyResponse(rendererId, fixtures));
}

function getRendererCoreState() {
  return getState<RendererCoreSpec>('rendererCore');
}

it('creates renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockRendererReadyResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoreState()).toEqual({
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
    expect(getRendererCoreState()).toEqual({
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
    expect(getRendererCoreState()).toEqual({
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
    expect(getRendererCoreState()).toEqual({
      connectedRendererIds: ['mockRendererId1', 'mockRendererId2'],
      primaryRendererId: 'mockRendererId1',
      fixtures,
      fixtureState: null
    })
  );
});
