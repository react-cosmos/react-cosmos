// @flow

import React from 'react';
import { wait, waitForElement, render, cleanup } from 'react-testing-library';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { RegisterMethod } from '../../jestHelpers/RegisterMethod';
import { OnEvent } from '../../jestHelpers/OnEvent';
import { EmitEvent } from '../../jestHelpers/EmitEvent';
import { CallMethod } from '../../jestHelpers/CallMethod';
import { OnPluginState } from '../../jestHelpers/OnPluginState';
import {
  getUrlParams,
  pushUrlParams,
  popUrlParams,
  resetUrl
} from '../../jestHelpers/url';

// Plugins have side-effects: they register themselves
import '.';

// TODO: Explain
register(
  <Plugin name="Test">
    <Plug
      slot="root"
      render={({ children }) => <div data-testid="test-plugin">{children}</div>}
    />
  </Plugin>
);

afterEach(() => {
  cleanup();
  resetUrl();
});

it('renders "root" slot', async () => {
  const { getByTestId } = renderPlayground(
    <RegisterMethod methodName="renderer.postRequest" handler={jest.fn()} />
  );

  await waitForElement(() => getByTestId('test-plugin'));
});

it('renders content from "root" slot', async () => {
  const { getByText } = renderPlayground();

  await waitForElement(() => getByText(/content renderered by other plugins/i));
});

const fixtureListMsg = {
  type: 'fixtureList',
  payload: {
    rendererId: 'foo-renderer',
    fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
  }
};

it('sends fixtureSelect request on initial "fixture" URL param', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

  const handlePostReq = jest.fn();
  renderPlayground(
    <RegisterMethod methodName="renderer.postRequest" handler={handlePostReq} />
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
  const handleRendererRes = jest.fn();
  renderPlayground(
    <>
      <RegisterMethod
        methodName="renderer.postRequest"
        handler={handlePostReq}
      />
      <OnEvent eventName="renderer.onResponse" handler={handleRendererRes} />
    </>
  );

  // Wait for fixture list to be received
  await wait(() => expect(handleRendererRes).toBeCalledWith(fixtureListMsg));

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
  const handleRendererRes = jest.fn();
  renderPlayground(
    <>
      <RegisterMethod
        methodName="renderer.postRequest"
        handler={handlePostReq}
      />
      <OnEvent eventName="renderer.onResponse" handler={handleRendererRes} />
    </>
  );

  // Wait for fixture list to be received
  await wait(() => expect(handleRendererRes).toBeCalledWith(fixtureListMsg));

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
      <RegisterMethod methodName="renderer.postRequest" handler={jest.fn()} />
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
      <RegisterMethod methodName="renderer.postRequest" handler={jest.fn()} />
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

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="root">Content renderered by other plugins</Slot>
      <EmitEvent eventName="renderer.onResponse" args={[fixtureListMsg]} />
      {otherNodes}
    </PlaygroundProvider>
  );
}
