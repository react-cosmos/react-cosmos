// @flow

import { wait } from 'react-testing-library';
import { loadPlugins } from 'react-plugin';
import {
  getUrlParams,
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../testHelpers/url';
import {
  cleanup,
  getPluginState,
  mockMethod,
  mockInitCall
} from '../../testHelpers/plugin';
import { register } from '.';

afterEach(() => {
  cleanup();
  resetUrl();
});

it('posts "selectFixture" renderer request on "fixturePath" URL param change', () => {
  register();

  const handleSelectFixture = jest.fn();
  mockMethod('renderer.selectFixture', handleSelectFixture);

  loadPlugins();

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handleSelectFixture).toBeCalledWith(
    expect.any(Object),
    'fixtures/zwei.js'
  );
});

it('posts "unselectFixture" renderer request on removed "fixturePath" URL param', async () => {
  register();

  const handleUnselectFixture = jest.fn();
  mockMethod('renderer.unselectFixture', handleUnselectFixture);

  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });
  loadPlugins();

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleUnselectFixture).toBeCalled();
});

describe('on "setUrlParams" method', () => {
  function mockSetUrlParamsCall() {
    mockInitCall('router.setUrlParams', { fixturePath: 'fixtures/zwei.js' });
  }

  it('sets "router" state', async () => {
    register();
    mockMethod('renderer.selectFixture', () => {});
    mockSetUrlParamsCall();

    loadPlugins();

    await wait(() =>
      expect(getPluginState('router').urlParams).toEqual({
        fixturePath: 'fixtures/zwei.js'
      })
    );
  });

  it('sets URL params', async () => {
    register();
    mockMethod('renderer.selectFixture', () => {});
    mockSetUrlParamsCall();

    loadPlugins();

    await wait(() =>
      expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' })
    );
  });

  it('calls "renderer.selectFixture" method', async () => {
    register();
    mockSetUrlParamsCall();

    const handleSelectFixture = jest.fn();
    mockMethod('renderer.selectFixture', handleSelectFixture);

    loadPlugins();

    await wait(() =>
      expect(handleSelectFixture).toBeCalledWith(
        expect.any(Object),
        'fixtures/zwei.js'
      )
    );
  });
});
