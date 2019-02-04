import { wait } from 'react-testing-library';
import { IPluginContext, loadPlugins } from 'react-plugin';
import { RendererId, RendererRequest } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  on,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin2';
import { RouterSpec } from '../../../Router/public';
import { createRendererReadyResponse } from '../../testHelpers';
import { State } from '../../shared';
import { RendererCoordinatorSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixturePath = 'ein.js';
const fixtures = [fixturePath];
const fixtureState = { components: [] };

function registerTestPlugins(
  handleRendererRequest: (
    context: IPluginContext<any>,
    msg: RendererRequest
  ) => void
) {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath })
  });
  on<RendererCoordinatorSpec>('rendererCoordinator', {
    request: handleRendererRequest
  });
}

function loadTestPlugins(state?: State) {
  loadPlugins({ state: { rendererCoordinator: state } });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoordinatorSpec>('rendererCoordinator');
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
