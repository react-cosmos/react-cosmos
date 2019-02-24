import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { NotificationsSpec } from '../../../Notifications/public';
import { createRendererReadyResponse } from '../../testHelpers';
import { RendererCoreSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
}

function mockRendererReadyResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(createRendererReadyResponse(rendererId, {}));
}

it('notifies renderer connection', async () => {
  registerTestPlugins();

  const pushNotification = jest.fn();
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification
  });

  loadPlugins();
  mockRendererReadyResponse('mockRendererId1');

  await wait(() =>
    expect(pushNotification).toBeCalledWith(expect.any(Object), {
      type: 'success',
      content: 'Renderer connected'
    })
  );
});
