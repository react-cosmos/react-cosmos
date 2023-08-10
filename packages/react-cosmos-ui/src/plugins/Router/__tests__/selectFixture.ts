import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getRouterMethods,
  onRouter,
} from '../../../testHelpers/pluginMocks.js';
import {
  getUrlParams,
  resetUrlParams,
} from '../../../testHelpers/urlParams.js';
import { register } from '../index.js';

beforeEach(register);

afterEach(() => {
  resetPlugins();
  resetUrlParams();
});

const fixtureId = { path: 'zwei.js' };

it('updates selected fixture ID', async () => {
  loadPlugins();
  const router = getRouterMethods();
  router.selectFixture(fixtureId);

  await waitFor(() => expect(router.getSelectedFixtureId()).toBe(fixtureId));
});

it('sets URL params', async () => {
  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);

  await waitFor(() =>
    expect(getUrlParams()).toEqual({ fixtureId: JSON.stringify(fixtureId) })
  );
});

it('emits "fixtureSelect" event', async () => {
  const { fixtureSelect } = onRouter();

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);

  await waitFor(() =>
    expect(fixtureSelect).toBeCalledWith(expect.any(Object), fixtureId)
  );
});
