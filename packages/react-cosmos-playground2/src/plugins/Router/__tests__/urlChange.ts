import { loadPlugins, resetPlugins } from 'react-plugin';
import {
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../../testHelpers/url';
import { onRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(() => {
  resetPlugins();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

it('emits "fixtureChange" event on "fixtureId" URL param change', () => {
  register();
  const { fixtureChange } = onRouter();

  loadPlugins();
  popUrlParams({ fixtureId: JSON.stringify(fixtureId) });

  expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId);
});

it('emits "fixtureChange" event on removed "fixtureId" URL param', async () => {
  register();
  const { fixtureChange } = onRouter();

  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(fixtureChange).toBeCalledWith(expect.any(Object), null);
});
