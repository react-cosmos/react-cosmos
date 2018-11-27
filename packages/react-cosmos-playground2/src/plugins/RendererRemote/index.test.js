// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../plugin';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { OnEvent } from '../../testHelpers/OnEvent';
import { mockWebSockets } from '../../testHelpers/mockWebSockets';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

it('posts renderer request message via websockets', async () => {
  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };

  renderPlayground(
    <EmitEvent eventName="renderer.request" args={[selectFixtureMsg]} />
  );

  await mockWebSockets(async ({ onMessage }) => {
    await wait(() => expect(onMessage).toBeCalledWith(selectFixtureMsg));
  });
});

it('broadcasts renderer response message from websocket event', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };

  const handleRendererResponse = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.response" handler={handleRendererResponse} />
  );

  await mockWebSockets(async ({ postMessage }) => {
    postMessage(fixtureListMsg);

    await wait(() =>
      expect(handleRendererResponse).toBeCalledWith(fixtureListMsg)
    );
  });
});

it('posts "requestFixtureList" renderer request on mount', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'requestFixtureList'
    })
  );
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider config={{ renderer: { enableRemote: true } }}>
      {otherNodes}
      <Slot name="global" />
    </PluginProvider>
  );
}
