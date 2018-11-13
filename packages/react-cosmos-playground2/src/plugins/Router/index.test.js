// @flow

import React from 'react';
import { wait, waitForElement, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { OnEvent } from '../../jestHelpers/OnEvent';
import { EmitEvent } from '../../jestHelpers/EmitEvent';
import { CallMethod } from '../../jestHelpers/CallMethod';
import { OnPluginState } from '../../jestHelpers/OnPluginState';
import { SetPluginState } from '../../jestHelpers/SetPluginState';
import { registerTestPlugin } from '../../jestHelpers/testPlugin';
import {
  getUrlParams,
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../jestHelpers/url';

// Plugins have side-effects: they register themselves
require('.');
registerTestPlugin('root');

afterEach(() => {
  cleanup();
  resetUrl();
});

it('renders "root" slot', async () => {
  const { getByTestId } = renderPlayground();

  await waitForElement(() => getByTestId('test-plugin'));
});

it('renders content from "root" slot', async () => {
  const { getByText } = renderPlayground();

  await waitForElement(() => getByText(/content renderered by other plugins/i));
});

it('sends fixtureSelect request on initial "fixture" URL param', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

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

  popUrlParams({ fixture: 'fixtures/zwei.js' });

  expect(handlePostReq).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

it('sends null fixtureSelect request on removed "fixture" URL param', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

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
  const handlePluginState = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={jest.fn()} />
      <OnPluginState pluginName="router" handler={handlePluginState} />
      <CallMethod
        methodName="router.setUrlParams"
        args={[{ fixture: 'fixtures/zwei.js' }]}
      />
    </>
  );

  // Wait for plugin state to propagate
  await wait(() =>
    expect(handlePluginState).toBeCalledWith({ fixture: 'fixtures/zwei.js' })
  );
});

it('sets URL params on "setUrlParams" method', async () => {
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={jest.fn()} />
      <CallMethod
        methodName="router.setUrlParams"
        args={[{ fixture: 'fixtures/zwei.js' }]}
      />
    </>
  );

  await wait(() =>
    expect(getUrlParams()).toEqual({ fixture: 'fixtures/zwei.js' })
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
      <Slot name="root">Content renderered by other plugins</Slot>
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
      {otherNodes}
    </PlaygroundProvider>
  );
}
