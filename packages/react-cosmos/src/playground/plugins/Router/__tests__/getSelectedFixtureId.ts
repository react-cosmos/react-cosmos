import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { getRouterMethods } from '../../../testHelpers/pluginMocks';
import { pushUrlParams, resetUrlParams } from '../../../testHelpers/urlParams';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(() => {
  resetPlugins();
  resetUrlParams();
});

const fixtureId = { path: 'zwei.js' };

it('returns fixtureId', async () => {
  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();

  await waitFor(() =>
    expect(getRouterMethods().getSelectedFixtureId()).toEqual(fixtureId)
  );
});

it('returns null', async () => {
  loadPlugins();

  await waitFor(() =>
    expect(getRouterMethods().getSelectedFixtureId()).toBe(null)
  );
});
