import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
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

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => fixtureId
  });
  mockNotifications();
  const { request } = onRendererCore();
  return { request };
}

function loadTestPlugins() {
  loadPlugins();
}

it('posts "selectFixture" renderer request', async () => {
  const { request } = registerTestPlugins();

  loadTestPlugins();
  mockRendererReady('mockRendererId', fixtures);

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
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
  const { request } = registerTestPlugins();

  loadTestPlugins();
  mockRendererReady('mockRendererId1', fixtures);
  mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
  mockRendererReady('mockRendererId2', fixtures);

  await wait(() =>
    expect(request).toBeCalledWith(expect.any(Object), {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId2',
        fixtureId,
        fixtureState
      }
    })
  );
});
