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
  const handleSelectFixture = jest.fn();

  loadTestPlugins(() => {
    mockMethod('renderer.selectFixture', handleSelectFixture);
  });

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handleSelectFixture).toBeCalledWith(
    expect.any(Object),
    'fixtures/zwei.js'
  );
});

it('posts "unselectFixture" renderer request on removed "fixturePath" URL param', async () => {
  const handleUnselectFixture = jest.fn();

  loadTestPlugins(() => {
    mockMethod('renderer.unselectFixture', handleUnselectFixture);
    pushUrlParams({ fixturePath: 'fixtures/zwei.js' });
  });

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleUnselectFixture).toBeCalled();
});

describe('on "setUrlParams" method', () => {
  function mockSetUrlParamsCall() {
    mockInitCall('router.setUrlParams', { fixturePath: 'fixtures/zwei.js' });
  }

  it('sets "router" state', async () => {
    loadTestPlugins(() => {
      mockMethod('renderer.selectFixture', () => {});
      mockSetUrlParamsCall();
    });

    await wait(() =>
      expect(getPluginState('router').urlParams).toEqual({
        fixturePath: 'fixtures/zwei.js'
      })
    );
  });

  it('sets URL params', async () => {
    loadTestPlugins(() => {
      mockMethod('renderer.selectFixture', () => {});
      mockSetUrlParamsCall();
    });

    await wait(() =>
      expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' })
    );
  });

  it('calls "renderer.selectFixture" method', async () => {
    const handleSelectFixture = jest.fn();

    loadTestPlugins(() => {
      mockMethod('renderer.selectFixture', handleSelectFixture);
      mockSetUrlParamsCall();
    });

    await wait(() =>
      expect(handleSelectFixture).toBeCalledWith(
        expect.any(Object),
        'fixtures/zwei.js'
      )
    );
  });
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  extraSetup();
  loadPlugins();
}
