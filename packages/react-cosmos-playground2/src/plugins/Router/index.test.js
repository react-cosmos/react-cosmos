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

it('sends fixtureSelect request on initial "fixture" URL param', async () => {
  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });

  const handlePostReq = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.request" handler={handlePostReq} />
  );

  await wait(() =>
    expect(handlePostReq).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js'
      }
    })
  );
});

it('sends fixtureSelect request on added "fixture" URL param', async () => {
  const handlePostReq = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.request" handler={handlePostReq} />
  );

  popUrlParams({ fixturePath: 'fixtures/zwei.js' });

  expect(handlePostReq).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

it('sends null fixtureSelect request on removed "fixture" URL param', async () => {
  pushUrlParams({ fixturePath: 'fixtures/zwei.js' });

  const handlePostReq = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.request" handler={handlePostReq} />
  );

  // This simulation is akin to going back home after selecting a fixture
  popUrlParams({});

  expect(handlePostReq).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: null
    }
  });
});

it('updates router state on "setUrlParams" method', async () => {
  const handleSetUrlParams = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={jest.fn()} />
      <OnPluginState pluginName="urlParams" handler={handleSetUrlParams} />
      <CallMethod
        methodName="router.setUrlParams"
        args={[{ fixturePath: 'fixtures/zwei.js' }]}
      />
    </>
  );

  // Wait for plugin state to propagate
  await wait(() =>
    expect(handleSetUrlParams).toBeCalledWith({
      fixturePath: 'fixtures/zwei.js'
    })
  );
});

it('sets URL params on "setUrlParams" method', async () => {
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={jest.fn()} />
      <CallMethod
        methodName="router.setUrlParams"
        args={[{ fixturePath: 'fixtures/zwei.js' }]}
      />
    </>
  );

  await wait(() =>
    expect(getUrlParams()).toEqual({ fixturePath: 'fixtures/zwei.js' })
  );
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

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: mockRendererId
      }}
    >
      <Slot name="global" />
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
      {otherNodes}
    </PlaygroundProvider>
  );
}
