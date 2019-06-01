import { wait } from 'react-testing-library';
import { loadPlugins, PluginContext } from 'react-plugin';
import { Message } from 'react-cosmos-shared2/util';
import { cleanup } from '../../../../testHelpers/plugin';
import { mockRendererReady, mockFixtureStateChange } from '../../testHelpers';
import { register } from '../..';
import {
  mockRouter,
  mockNotifications,
  onRendererCore
} from '../../../../testHelpers/pluginMocks';

afterEach(cleanup);

const fixtureId = { path: 'ein.js', name: null };
const fixtures = { [fixtureId.path]: null };
const fixtureState = { props: [] };

function registerTestPlugins(
  handleRendererRequest: (context: PluginContext<any>, msg: Message) => void
) {
  register();
  mockRouter({
    getSelectedFixtureId: () => fixtureId
  });
  mockNotifications();
  onRendererCore({
    request: handleRendererRequest
  });
}

function loadTestPlugins() {
  loadPlugins();
}

it('posts "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);

  loadTestPlugins();
  mockRendererReady('mockRendererId', fixtures);

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId,
        fixtureState: {}
      }
    })
  );
});

it('posts "selectFixture" renderer request with fixture state', async () => {
  const handleRendererRequest = jest.fn();
  registerTestPlugins(handleRendererRequest);

  loadTestPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
  mockRendererReady('mockRendererId2', fixtures);

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
