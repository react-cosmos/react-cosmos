import { RendererId } from 'react-cosmos-shared2/renderer';
import { loadPlugins } from 'react-plugin';
import { wait } from 'react-testing-library';
import { register } from '../..';
import {
  cleanup,
  getMethodsOf,
  getState,
  mockMethodsOf
} from '../../../../testHelpers/plugin';
import { NotificationsSpec } from '../../../Notifications/public';
import { RouterSpec } from '../../../Router/public';
import { RendererCoreSpec } from '../../public';
import { State } from '../../shared';
import { createRendererReadyResponse } from '../../testHelpers';

afterEach(cleanup);

const fixtures = { 'ein.js': null };
const fixtureState = { components: [] };

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
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
