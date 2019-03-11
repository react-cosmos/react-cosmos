import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../../testHelpers/plugin';
import { NotificationsSpec } from '../../../Notifications/public';
import { RouterSpec } from '../../../Router/public';
import {
  getRendererCoreMethods,
  mockRendererReady,
  mockFixtureStateChange
} from '../../testHelpers';
import { register } from '../..';

afterEach(cleanup);

const fixtures = { 'ein.js': null };
const fixtureId = { path: 'zwei.js', name: null };
const fixtureState = { components: [] };

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => fixtureId
  });
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
  });
}

function loadTestPlugins() {
  loadPlugins();
}

describe('single renderer', () => {
  function setup() {
    registerTestPlugins();
    loadTestPlugins();
    mockRendererReady('mockRendererId1', fixtures);
  }

  it('sets connected renderer IDs', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
        'mockRendererId1'
      ])
    );
  });

  it('sets primary renderer ID', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
        'mockRendererId1'
      )
    );
  });

  it('sets fixtures', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
    );
  });

  it('sets null fixture state', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getFixtureState()).toBeNull()
    );
  });

  it('keeps fixtures state when secondary renderer connects', async () => {
    setup();
    mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
    mockRendererReady('mockRendererId2', fixtures);

    await wait(() =>
      expect(getRendererCoreMethods().getFixtureState()).toEqual(fixtureState)
    );
  });
});

describe('multi renderers', () => {
  function setup() {
    registerTestPlugins();
    loadTestPlugins();
    mockRendererReady('mockRendererId1', fixtures);
    mockRendererReady('mockRendererId2', fixtures);
    mockFixtureStateChange('mockRendererId1', fixtureId, fixtureState);
  }

  it('sets connected renderer IDs', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getConnectedRendererIds()).toEqual([
        'mockRendererId1',
        'mockRendererId2'
      ])
    );
  });

  it('sets primary renderer ID', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getPrimaryRendererId()).toEqual(
        'mockRendererId1'
      )
    );
  });

  it('sets fixtures', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getFixtures()).toEqual(fixtures)
    );
  });

  it('sets fixture state', async () => {
    setup();
    await wait(() =>
      expect(getRendererCoreMethods().getFixtureState()).toEqual(fixtureState)
    );
  });

  it('resets fixtures state when primary renderer re-connects', async () => {
    setup();
    mockRendererReady('mockRendererId1', fixtures);

    await wait(() =>
      expect(getRendererCoreMethods().getFixtureState()).toBeNull()
    );
  });
});
