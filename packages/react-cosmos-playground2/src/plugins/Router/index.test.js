// @flow

import React from 'react';
import { render, wait, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { CallMethod } from '../../testHelpers/CallMethod';
import { OnPluginState } from '../../testHelpers/OnPluginState';
import { SetPluginState } from '../../testHelpers/SetPluginState';
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

const mockRendererId = 'foo-renderer';

const mockFixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/drei.js'
];

const mockRendererStates = {
  [mockRendererId]: {
    fixtures: mockFixtures,
    fixtureState: null
  }
};

it('posts "fixtureSelect" renderer request on "fixturePath" URL param change', async () => {
  const handleSelectFixture = jest.fn();
  renderPlayground(
    <>
      <SetPluginState stateKey="renderers" value={mockRendererStates} />
      <RegisterMethod
        methodName="renderer.selectFixture"
        handler={handleSelectFixture}
      />
    </>
  );

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handleSelectFixture).toBeCalledWith('fixtures/zwei.js');
});

it('posts null "fixtureSelect" renderer request on removed "fixturePath" URL param', async () => {
  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });

  const handleSelectFixture = jest.fn();
  renderPlayground(
    <>
      <SetPluginState stateKey="renderers" value={mockRendererStates} />
      <RegisterMethod
        methodName="renderer.selectFixture"
        handler={handleSelectFixture}
      />
    </>
  );

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleSelectFixture).toBeCalledWith(null);
});

describe('on "setUrlParams" method', () => {
  it('sets "urlParams" state', async () => {
    const handleSetUrlParams = jest.fn();
    renderPlaygroundAndCallSetUrlParams(
      <>
        <OnPluginState pluginName="urlParams" handler={handleSetUrlParams} />
        <RegisterMethod
          methodName="renderer.selectFixture"
          handler={() => {}}
        />
      </>
    );

    await wait(() =>
      expect(handleSetUrlParams).toBeCalledWith({
        fixturePath: 'fixtures/zwei.js'
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
    <PlaygroundProvider
      options={{
        rendererPreviewUrl: mockRendererId,
        enableRemoteRenderers: false
      }}
    >
      <Slot name="global" />
      {otherNodes}
    </PlaygroundProvider>
  );
}
