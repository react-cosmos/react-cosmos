import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { pushUrlParams, resetUrl } from '../../../testHelpers/url';
import { getRouterMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  resetPlugins();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

it('returns fixtureId', async () => {
  register();

  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();

  await waitFor(() =>
    expect(getRouterMethods().getSelectedFixtureId()).toEqual(fixtureId)
  );
});

it('returns null', async () => {
  register();
  loadPlugins();

  await waitFor(() =>
    expect(getRouterMethods().getSelectedFixtureId()).toBe(null)
  );
});
