// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import { getUrlParams, resetUrl } from '../../../testHelpers/url';
import {
  cleanup,
  getPluginState,
  mockEvent,
  mockCall
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetUrl();
});

function mockSetUrlParamsCall() {
  mockCall('router.setUrlParams', { fixturePath: 'fixtures/zwei.js' });
}

it('sets "router" state', async () => {
  register();
  loadPlugins();
  mockSetUrlParamsCall();

  await wait(() =>
    expect(getPluginState('router').urlParams).toEqual({
      fixturePath: 'fixtures/zwei.js'
    })
  );
});

it('sets URL params', async () => {
  register();
  loadPlugins();
  mockSetUrlParamsCall();

  await wait(() =>
    expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' })
  );
});

it('emits "fixtureChange" event', async () => {
  register();

  const handleFixtureChange = jest.fn();
  mockEvent('router.fixtureChange', handleFixtureChange);

  loadPlugins();
  mockSetUrlParamsCall();

  await wait(() =>
    expect(handleFixtureChange).toBeCalledWith(
      expect.any(Object),
      'fixtures/zwei.js'
    )
  );
});
