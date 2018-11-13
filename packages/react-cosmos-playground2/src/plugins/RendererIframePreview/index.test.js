/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { OnEvent } from '../../testHelpers/OnEvent';
import { mockIframeMessage } from '../../testHelpers/mockIframeMessage';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

it('renders iframe with options.rendererUrl src', () => {
  const renderer = renderPlayground();

  expect(getIframe(renderer)).toBeTruthy();
  expect(getIframe(renderer).src).toMatch('foo-renderer');
});

it('posts renderer request message to iframe', async () => {
  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };

  // Fake another plugin that posts a renderer request
  const renderer = renderPlayground(
    <EmitEvent eventName="renderer.request" args={[selectFixtureMsg]} />
  );
  const iframe = getIframe(renderer);

  await mockIframeMessage(iframe, async ({ onMessage }) => {
    await wait(() =>
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('broadcasts renderer response message from iframe', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };

  // Fake another plugin that listens to renderer responses
  const handleRendererReq = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.response" handler={handleRendererReq} />
  );

  window.postMessage(fixtureListMsg, '*');

  await wait(() => expect(handleRendererReq).toBeCalledWith(fixtureListMsg));
});

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="preview" />
      {otherNodes}
    </PlaygroundProvider>
  );
}

function getIframe({ getByTestId }) {
  return getByTestId('preview-iframe');
}
