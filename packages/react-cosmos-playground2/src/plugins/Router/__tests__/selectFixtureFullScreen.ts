import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import { cleanup } from '../../../testHelpers/plugin';
import { getRouterMethods } from '../../../testHelpers/pluginMocks';
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
  router.selectFixture(fixtureId, true);

  await wait(() => expect(router.getSelectedFixtureId()).toBe(fixtureId));
});

it('updates fullscreen state', async () => {
  register();
  loadPlugins();
  const router = getRouterMethods();
  router.selectFixture(fixtureId, true);

  await wait(() => expect(router.isFullScreen()).toBe(true));
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
