import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRouterMethods,
  onRouter,
} from '../../../testHelpers/pluginMocks.js';
import {
  getUrlParams,
  pushUrlParams,
  resetUrlParams,
} from '../../../testHelpers/urlParams.js';
import { register } from '../index.js';

beforeEach(register);

afterEach(() => {
  resetPlugins();
  resetUrlParams();
});

const fixtureId = { path: 'zwei.js' };

function loadTestPlugins() {
  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();
}

it('updates selected fixture ID', async () => {
  loadTestPlugins();
  const router = getRouterMethods();
  router.unselectFixture();

  await waitFor(() => expect(router.getSelectedFixtureId()).toEqual(null));
});

it('sets URL params', async () => {
  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await waitFor(() => expect(getUrlParams()).toEqual({}));
});

it('emits "fixtureUnselect" event', async () => {
  const { fixtureUnselect } = onRouter();

  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await waitFor(() =>
    expect(fixtureUnselect).toBeCalledWith(expect.any(Object))
  );
});
