import { RendererId, RendererRequest } from 'react-cosmos-shared2/renderer';
import { loadPlugins, PluginContext } from 'react-plugin';
import { wait } from 'react-testing-library';
import { register } from '../..';
import {
  cleanup,
  getMethodsOf,
  mockMethodsOf,
  on
} from '../../../../testHelpers/plugin';
import { NotificationsSpec } from '../../../Notifications/public';
import { RouterSpec } from '../../../Router/public';
import { RendererCoreSpec } from '../../public';
import { State } from '../../shared';
import { createRendererReadyResponse } from '../../testHelpers';

afterEach(cleanup);

const fixtureId = { path: 'ein.js', name: null };
const fixtures = { [fixtureId.path]: null };
const fixtureState = { components: [] };

function registerTestPlugins(
  handleRendererRequest: (
    context: PluginContext<any>,
    msg: RendererRequest
  ) => void
) {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => fixtureId
  });
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
  });
  on<RendererCoreSpec>('rendererCore', {
    request: handleRendererRequest
  });
}

function loadTestPlugins(state?: State) {
  loadPlugins({ state: { rendererCore: state } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(createRendererReadyResponse(rendererId, fixtures));
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
        fixtureId,
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
        fixtureId,
        fixtureState
      }
    })
  );
});
