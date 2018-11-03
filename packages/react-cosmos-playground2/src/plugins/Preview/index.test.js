/* eslint-env browser */
// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { PostRendererRequest } from '../../jestHelpers/PostRendererRequest';
import { OnRendererResponse } from '../../jestHelpers/OnRendererResponse';
import { mockIframeMessage } from '../../jestHelpers/mockIframeMessage';

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
    <PostRendererRequest msg={selectFixtureMsg} />
  );
  const iframe = getIframe(renderer);

  await mockIframeMessage(iframe, async ({ onMessage }) => {
    await wait(() =>
      expect(onMessage.mock.calls[0][0].data).toEqual(selectFixtureMsg)
    );
  });
});

it('receives renderer response message from iframe', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };

  // Fake another plugin that listens to renderer responses
  const rendererResponseHandler = jest.fn();
  renderPlayground(<OnRendererResponse handler={rendererResponseHandler} />);

  window.postMessage(fixtureListMsg, '*');

  await wait(() =>
    expect(rendererResponseHandler).toBeCalledWith(fixtureListMsg)
  );
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
