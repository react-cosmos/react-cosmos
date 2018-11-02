// @flow

import React, { Component } from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundContext } from '../../context';
import { Root } from '../../Root';

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
      rendererId: 'foo-rendererId',
      fixturePath: 'bar-fixturePath'
    }
  };

  // Fake another plugin that posts a renderer request (via
  // PlaygroundContext.postRendererRequest)
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

function renderPlayground(otherNodes) {
  return render(
    <Root
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="preview" />
      {otherNodes}
    </Root>
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
