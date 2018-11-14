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
  expect(getIframe(renderer).src).toMatch('mockRendererUrl');
});

it('posts renderer request message to iframe', async () => {
  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'bar-fixturePath'
    }
  };

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

  const handleRendererResponse = jest.fn();
  renderPlayground(
    <OnEvent eventName="renderer.response" handler={handleRendererResponse} />
  );

  window.postMessage(fixtureListMsg, '*');

  await wait(() =>
    expect(handleRendererResponse).toBeCalledWith(fixtureListMsg)
  );
});

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererPreviewUrl: 'mockRendererUrl'
      }}
    >
      <Slot name="rendererPreview" />
      {otherNodes}
    </PlaygroundProvider>
  );
}

function getIframe({ getByTestId }) {
  return getByTestId('preview-iframe');
}
