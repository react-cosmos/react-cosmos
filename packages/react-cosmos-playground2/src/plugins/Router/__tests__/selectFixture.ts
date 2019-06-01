import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import { cleanup } from '../../../testHelpers/plugin';
import { getRouterMethods, onRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

it('updates selected fixture ID', async () => {
  register();
  loadPlugins();
  const router = getRouterMethods();
  router.selectFixture(fixtureId, false);

  await wait(() => expect(router.getSelectedFixtureId()).toBe(fixtureId));
});

it('updates fullscreen state', async () => {
  register();
  loadPlugins();
  const router = getRouterMethods();
  router.selectFixture(fixtureId, false);

  await wait(() => expect(router.isFullScreen()).toBe(false));
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
  onRouter({ fixtureChange });

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId, false);

  await wait(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId)
  );
});
