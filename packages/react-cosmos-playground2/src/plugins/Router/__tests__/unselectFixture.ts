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
const routerState: RouterSpec['state'] = { urlParams: { fixtureId } };

function loadTestPlugins() {
  loadPlugins({
    state: {
      router: routerState
    }
  });
}

function getRouterMethods() {
  return getMethodsOf<RouterSpec>('router');
}

function getRouterState() {
  return getState<RouterSpec>('router');
}

it('sets "router" state', async () => {
  register();
  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await wait(() => expect(getRouterState().urlParams).toEqual({}));
});

it('sets URL params', async () => {
  register();
  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await wait(() => expect(getUrlParams()).toEqual({}));
});

it('emits "fixtureChange" event', async () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await wait(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), null)
  );
});
