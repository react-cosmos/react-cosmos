/* eslint-env browser */
// @flow

import React, { Component } from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';
import { PlaygroundProvider } from '../../PlaygroundProvider';

// Plugins have side-effects: they register themselves
import '.';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';

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
      // TODO: Test other variations
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

class PostRendererRequest extends Component<{ msg: RendererRequest }> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    this.context.postRendererRequest(this.props.msg);
  }

  render() {
    return null;
  }
}

class OnRendererResponse extends Component<{ handler: Response => mixed }> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    this.context.onRendererResponse(this.props.handler);
  }

  render() {
    return null;
  }
}

async function mockIframeMessage(iframe, children) {
  const { contentWindow } = iframe;
  const onMessage = jest.fn();

  try {
    contentWindow.addEventListener('message', onMessage, false);
    await children({ onMessage });
  } catch (err) {
    // Make errors visible
    throw err;
  } finally {
    contentWindow.removeEventListener('message', onMessage);
  }
}
