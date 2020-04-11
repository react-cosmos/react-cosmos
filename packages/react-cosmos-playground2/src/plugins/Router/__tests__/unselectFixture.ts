import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  getUrlParams,
  pushUrlParams,
  resetUrl
} from '../../../testHelpers/url';
import { getRouterMethods, onRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  resetPlugins();
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

  await waitFor(() => expect(router.getSelectedFixtureId()).toEqual(null));
});

it('sets URL params', async () => {
  register();
  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await waitFor(() => expect(getUrlParams()).toEqual({}));
});

it('emits "fixtureChange" event', async () => {
  register();
  const { fixtureChange } = onRouter();

  loadTestPlugins();
  getRouterMethods().unselectFixture();

  await waitFor(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), null)
  );
});
