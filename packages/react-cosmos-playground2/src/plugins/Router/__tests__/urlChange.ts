import { loadPlugins } from 'react-plugin';
import {
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../../testHelpers/url';
import { cleanup, on } from '../../../testHelpers/plugin2';
import { RouterSpec } from '../public';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

it('emits "fixtureChange" event on "fixturePath" URL param change', () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  loadPlugins();
  popUrlParams({ fixturePath: 'zwei.js' });

  expect(fixtureChange).toBeCalledWith(expect.any(Object), 'zwei.js');
});

it('emits "fixtureChange" event on removed "fixturePath" URL param', async () => {
  register();

  const fixtureChange = jest.fn();
  on<RouterSpec>('router', { fixtureChange });

  pushUrlParams({ fixturePath: 'zwei.js' });
  loadPlugins();

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(fixtureChange).toBeCalledWith(expect.any(Object), null);
});
