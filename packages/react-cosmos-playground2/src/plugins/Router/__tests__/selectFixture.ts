import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import {
  cleanup,
  getState,
  getMethodsOf,
  on
} from '../../../testHelpers/plugin';
import { RouterSpec } from '../public';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

function getRouterMethods() {
  return getMethodsOf<RouterSpec>('router');
}

function getRouterState() {
  return getState<RouterSpec>('router');
}

it('sets "router" state', async () => {
  register();
  loadPlugins();
  getRouterMethods().selectFixture(fixtureId, false);

  await wait(() =>
    expect(getRouterState().urlParams).toEqual({
      fixtureId,
      fullScreen: false
    })
  );
});

it('sets URL params', async () => {
  register();
  loadPlugins();
  getRouterMethods().selectFixture(fixtureId, false);

  await wait(() =>
    expect(getUrlParams()).toEqual({ fixtureId: JSON.stringify(fixtureId) })
  );
});

it('emits "fixtureChange" event', async () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId, false);

  await wait(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId)
  );
});
