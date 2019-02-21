import { loadPlugins } from 'react-plugin';
import {
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../../testHelpers/url';
import { cleanup, on } from '../../../testHelpers/plugin';
import { RouterSpec } from '../public';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

const fixtureId = { path: 'zwei.js', name: null };

it('emits "fixtureChange" event on "fixtureId" URL param change', () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  loadPlugins();
  popUrlParams({ fixtureId: JSON.stringify(fixtureId) });

  expect(fixtureChange).toBeCalledWith(expect.any(Object), fixtureId);
});

it('emits "fixtureChange" event on removed "fixtureId" URL param', async () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  pushUrlParams({ fixtureId: JSON.stringify(fixtureId) });
  loadPlugins();

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(fixtureChange).toBeCalledWith(expect.any(Object), null);
});
