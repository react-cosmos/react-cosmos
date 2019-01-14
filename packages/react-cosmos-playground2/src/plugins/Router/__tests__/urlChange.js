// @flow

import { loadPlugins } from 'react-plugin';
import {
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../../testHelpers/url';
import { cleanup, mockEvent } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

it('emits "selectFixture" event on "fixturePath" URL param change', () => {
  register();

  const handleFixtureChange = jest.fn();
  mockEvent('router.fixtureChange', handleFixtureChange);

  loadPlugins();

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handleFixtureChange).toBeCalledWith(
    expect.any(Object),
    'fixtures/zwei.js'
  );
});

it('emits "selectFixture" event on removed "fixturePath" URL param', async () => {
  register();

  const handleFixtureChange = jest.fn();
  mockEvent('router.fixtureChange', handleFixtureChange);

  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });
  loadPlugins();

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleFixtureChange).toBeCalledWith(expect.any(Object), undefined);
});
