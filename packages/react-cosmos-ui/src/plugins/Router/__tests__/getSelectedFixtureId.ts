import { waitFor } from '@testing-library/dom';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { getRouterMethods } from '../../../testHelpers/pluginMocks.js';
import {
  pushUrlParams,
  resetUrlParams,
} from '../../../testHelpers/urlParams.js';

beforeEach(register);

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
