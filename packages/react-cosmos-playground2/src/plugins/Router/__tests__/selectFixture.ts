import { wait } from '@testing-library/react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import { getRouterMethods, onRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  resetPlugins();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

it('updates selected fixture ID', async () => {
  register();
  loadPlugins();
  const router = getRouterMethods();
  router.selectFixture(fixtureId);

  await wait(() => expect(router.getSelectedFixtureId()).toBe(fixtureId));
});

it('sets URL params', async () => {
  register();
  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);

  await wait(() =>
    expect(getUrlParams()).toEqual({ fixtureId: JSON.stringify(fixtureId) })
  );
});

it('emits "fixtureChange" event', async () => {
  register();
  const { fixtureChange } = onRouter();

  loadPlugins();
  getRouterMethods().selectFixture(fixtureId);

  await wait(() =>
    expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId)
  );
});
