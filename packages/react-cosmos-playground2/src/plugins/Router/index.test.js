// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { OnEvent } from '../../testHelpers/OnEvent';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { CallMethod } from '../../testHelpers/CallMethod';
import { OnPluginState } from '../../testHelpers/OnPluginState';
import { SetPluginState } from '../../testHelpers/SetPluginState';
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

const mockRendererState = {
  rendererIds: [mockRendererId],
  fixtures: mockFixtures
};

const mockFixtureListMsg = {
  type: 'fixtureList',
  payload: {
    rendererId: mockRendererId,
    fixtures: mockFixtures
  }
};

it('posts "fixtureSelect" renderer request on "fixtureList" renderer response', async () => {
  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });

  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js'
      }
    })
  );
});

it('posts "fixtureSelect" renderer request on "fixturePath" URL param change', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
    </>
  );

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handleRendererRequest).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

it('posts null "fixtureSelect" renderer request on removed "fixturePath" URL param', async () => {
  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });

  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
    </>
  );

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handleRendererRequest).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: null
    }
  });
});

describe('on "setUrlParams" method', () => {
  it('sets "urlParams" state', () => {
    const handleSetUrlParams = jest.fn();
    renderPlaygroundAndCallSetUrlParams(handleSetUrlParams);

    expect(handleSetUrlParams).toBeCalledWith({
      fixturePath: 'fixtures/zwei.js'
    });
  });

  it('sets URL params', () => {
    renderPlaygroundAndCallSetUrlParams();

    expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' });
  });

  function renderPlaygroundAndCallSetUrlParams(handleSetUrlParams = jest.fn()) {
    renderPlayground(
      <>
        <OnPluginState pluginName="urlParams" handler={handleSetUrlParams} />
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
