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

it('sets selected fixture ID from initial fixture config', async () => {
  loadPlugins({
    config: {
      router: {
        initialFixtureId: fixtureId,
      },
    },
  });
  const router = getRouterMethods();

  await waitFor(() => expect(router.getSelectedFixtureId()).toBe(fixtureId));
});

it('sets URL params from initial fixture config', async () => {
  loadPlugins({
    config: {
      router: {
        initialFixtureId: fixtureId,
      },
    },
  });

  await waitFor(() =>
    expect(getUrlParams()).toEqual({ fixtureId: JSON.stringify(fixtureId) })
  );
});

it('emits "fixtureSelect" event from initial fixture config', async () => {
  const { fixtureSelect } = onRouter();

  loadPlugins({
    config: {
      router: {
        initialFixtureId: fixtureId,
      },
    },
  });

  await waitFor(() =>
    expect(fixtureSelect).toBeCalledWith(expect.any(Object), fixtureId)
  );
});

it('selects URL fixture param over initial fixture config', async () => {
  const urlFixtureId = { path: 'ein.js' };
  const configFixtureId = { path: 'zwei.js' };

  pushUrlParams({ fixtureId: JSON.stringify(urlFixtureId) });
  loadPlugins({
    config: {
      router: {
        initialFixtureId: configFixtureId,
      },
    },
  });
  const router = getRouterMethods();

  await waitFor(() =>
    expect(router.getSelectedFixtureId()).toEqual(urlFixtureId)
  );
});
