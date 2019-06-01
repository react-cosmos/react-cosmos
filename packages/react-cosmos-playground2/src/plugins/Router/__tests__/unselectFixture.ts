import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  getUrlParams,
  pushUrlParams,
  resetUrl
} from '../../../testHelpers/url';
import { cleanup } from '../../../testHelpers/plugin';
import { getRouterMethods, onRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

function loadTestPlugins() {
  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();
}

it('updates selected fixture ID', async () => {
  register();
  loadTestPlugins();
  const router = getRouterMethods();
  router.unselectFixture();

  await wait(() => expect(router.getSelectedFixtureId()).toEqual(null));
});

it('sets URL params', async () => {
  register();
  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await wait(() => expect(getUrlParams()).toEqual({}));
});

it('emits "fixtureChange" event', async () => {
  register();
  const { fixtureChange } = onRouter();

  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await wait(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), null)
  );
});
