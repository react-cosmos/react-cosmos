// @flow

import React from 'react';
import { render, wait, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../plugin';
import { CallMethod } from '../../testHelpers/CallMethod';
import { OnPluginState } from '../../testHelpers/OnPluginState';
import { RegisterMethod } from '../../testHelpers/RegisterMethod';
import {
  getUrlParams,
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../testHelpers/url';

// Plugins have side-effects: they register themselves
import '.';

afterEach(() => {
  cleanup();
  resetUrl();
});

it('posts "selectFixture" renderer request on "fixturePath" URL param change', async () => {
  const handleSelectFixture = jest.fn();
  renderPlayground(
    <>
      <RegisterMethod
        methodName="renderer.selectFixture"
        handler={handleSelectFixture}
      />
    </>
  );

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handleSelectFixture).toBeCalledWith('fixtures/zwei.js');
});

it('posts "unselectFixture" renderer request on removed "fixturePath" URL param', async () => {
  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });

  const handleUnselectFixture = jest.fn();
  renderPlayground(
    <RegisterMethod
      methodName="renderer.unselectFixture"
      handler={handleUnselectFixture}
    />
  );

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleUnselectFixture).toBeCalled();
});

describe('on "setUrlParams" method', () => {
  it('sets "router" state', async () => {
    const handleSetUrlParams = jest.fn();
    renderPlaygroundAndCallSetUrlParams(
      <>
        <OnPluginState pluginName="router" handler={handleSetUrlParams} />
        <RegisterMethod
          methodName="renderer.selectFixture"
          handler={() => {}}
        />
      </>
    );

    await wait(() =>
      expect(handleSetUrlParams).toBeCalledWith({
        urlParams: { fixturePath: 'fixtures/zwei.js' }
      })
    );
  });

  it('sets URL params', async () => {
    renderPlaygroundAndCallSetUrlParams(
      <RegisterMethod methodName="renderer.selectFixture" handler={() => {}} />
    );

    await wait(() =>
      expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' })
    );
  });

  it('calls "renderer.selectFixture" method', async () => {
    const handleSelectFixture = jest.fn();
    renderPlaygroundAndCallSetUrlParams(
      <RegisterMethod
        methodName="renderer.selectFixture"
        handler={handleSelectFixture}
      />
    );

    await wait(() =>
      expect(handleSelectFixture).toBeCalledWith('fixtures/zwei.js')
    );
  });

  function renderPlaygroundAndCallSetUrlParams(otherNodes) {
    renderPlayground(
      <>
        {otherNodes}
        <CallMethod
          methodName="router.setUrlParams"
          args={[{ fixturePath: 'fixtures/zwei.js' }]}
        />
      </>
    );
  }
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider>
      <Slot name="global" />
      {otherNodes}
    </PluginProvider>
  );
}
