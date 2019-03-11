import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  cleanup,
  getMethodsOf,
  mockMethodsOf
} from '../../../../testHelpers/plugin';
import { RouterSpec } from '../../../Router/public';
import { NotificationsSpec } from './../../../Notifications/public';
import {
  createFixtureListUpdateResponse,
  getRendererCoreMethods,
  mockRendererReady
} from '../../testHelpers';
import { RendererCoreSpec } from '../../public';
import { register } from '../..';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null
  });
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
  });
}

function loadTestPlugins() {
  loadPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockRendererReady('mockRendererId2', fixtures);
}

function mockFixtureListUpdateResponse(rendererId: RendererId) {
  const methods = getMethodsOf<RendererCoreSpec>('rendererCore');
  methods.receiveResponse(
    createFixtureListUpdateResponse(rendererId, {
      ...fixtures,
      'vier.js': null
    })
  );
}

it('updates fixtures in renderer state', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureListUpdateResponse('mockRendererId1');

  await wait(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual({
      ...fixtures,
      'vier.js': null
    })
  );
});

it('ignores update from secondary renderer', async () => {
  registerTestPlugins();
  loadTestPlugins();

  mockFixtureListUpdateResponse('mockRendererId2');

  await wait(() =>
    expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
  );
});
