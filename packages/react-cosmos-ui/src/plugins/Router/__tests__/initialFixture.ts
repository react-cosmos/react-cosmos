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

it('sets selected fixture ID', async () => {
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

it('sets URL params', async () => {
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

it('emits "fixtureSelect" event', async () => {
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
