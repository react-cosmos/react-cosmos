import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { resetUrl, pushUrlParams } from '../../../testHelpers/url';
import { cleanup, getMethodsOf } from '../../../testHelpers/plugin';
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

it('returns fixtureId', async () => {
  register();

  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();

  await wait(() =>
    expect(getRouterMethods().getSelectedFixtureId()).toEqual(fixtureId)
  );
});

it('returns null', async () => {
  register();
  loadPlugins();

  await wait(() =>
    expect(getRouterMethods().getSelectedFixtureId()).toBe(null)
  );
});
