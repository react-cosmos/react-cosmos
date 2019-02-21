import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import { cleanup, getState, getMethodsOf } from '../../../testHelpers/plugin';
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
  getRouterMethods().selectFixture(fixtureId, true);

  await wait(() =>
    expect(getRouterState().urlParams).toEqual({
      fixtureId,
      fullScreen: true
    })
  );
});

it('sets URL params', async () => {
  register();
  loadPlugins();
  getRouterMethods().selectFixture(fixtureId, true);

  await wait(() =>
    expect(getUrlParams()).toEqual({
      fixtureId: JSON.stringify(fixtureId),
      fullScreen: 'true'
    })
  );
});
