// @flow

import { wait } from 'react-testing-library';
import { onStateChange, getPluginContext } from 'ui-plugin';
import { resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import {
  getUrlParams,
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../testHelpers/url';
import { register } from '.';

afterEach(() => {
  resetPlugins();
  resetUrl();
});

it('posts "selectFixture" renderer request on "fixturePath" URL param change', () => {
  const handleSelectFixture = jest.fn();

  loadTestPlugins(() => {
    registerPlugin({ name: 'renderer' }).method(
      'selectFixture',
      handleSelectFixture
    );
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
    registerPlugin({ name: 'renderer' }).method(
      'unselectFixture',
      handleUnselectFixture
    );

    pushUrlParams({ fixturePath: 'fixtures/zwei.js' });
  });

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleUnselectFixture).toBeCalled();
});

describe('on "setUrlParams" method', () => {
  function mockRendererSelectFixtureMethod(handler = () => {}) {
    registerPlugin({ name: 'renderer' }).method('selectFixture', handler);
  }

  function mockSetUrlParamsCall() {
    registerPlugin({ name: 'testSetUrlParams' }).init(({ callMethod }) => {
      callMethod('router.setUrlParams', { fixturePath: 'fixtures/zwei.js' });
    });
  }

  it('sets "router" state', async () => {
    let urlParams;

    loadTestPlugins(() => {
      mockRendererSelectFixtureMethod();
      mockSetUrlParamsCall();
      onStateChange(() => {
        urlParams = getPluginContext('router').getState().urlParams;
      });
    });

    await wait(() =>
      expect(urlParams).toEqual({ fixturePath: 'fixtures/zwei.js' })
    );
  });

  it('sets URL params', async () => {
    loadTestPlugins(() => {
      mockRendererSelectFixtureMethod();
      mockSetUrlParamsCall();
    });

    await wait(() =>
      expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' })
    );
  });

  it('calls "renderer.selectFixture" method', async () => {
    const handleSelectFixture = jest.fn();

    loadTestPlugins(() => {
      mockRendererSelectFixtureMethod(handleSelectFixture);
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
