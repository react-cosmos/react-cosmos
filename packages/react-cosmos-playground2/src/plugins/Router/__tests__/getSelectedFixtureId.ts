import { wait } from '@testing-library/react';
import { loadPlugins } from 'react-plugin';
import { resetUrl, pushUrlParams } from '../../../testHelpers/url';
import { cleanup } from '../../../testHelpers/plugin';
import { getRouterMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

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
