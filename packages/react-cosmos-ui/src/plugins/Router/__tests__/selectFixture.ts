import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getRouterMethods,
  onRouter,
} from '../../../testHelpers/pluginMocks.js';
import {
  getUrlParams,
  resetUrlParams,
} from '../../../testHelpers/urlParams.js';

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

it('emits "fixtureChange" event', async () => {
  const { fixtureChange } = onRouter();

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);

  await waitFor(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId)
  );
});
