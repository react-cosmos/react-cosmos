import { loadPlugins, resetPlugins } from 'react-plugin';
import { onRouter } from '../../../testHelpers/pluginMocks.js';
import {
  popUrlParams,
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

it('emits "fixtureSelect" event on "fixtureId" URL param change', () => {
  const { fixtureSelect } = onRouter();

  loadPlugins();
  popUrlParams({ fixtureId: JSON.stringify(fixtureId) });

  expect(fixtureSelect).toBeCalledWith(expect.any(Object), fixtureId);
});

it('emits "fixtureUnselect" event on removed "fixtureId" URL param', async () => {
  const { fixtureUnselect } = onRouter();

  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(fixtureUnselect).toBeCalledWith(expect.any(Object));
});
