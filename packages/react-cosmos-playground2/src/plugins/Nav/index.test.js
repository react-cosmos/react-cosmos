// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from 'react-testing-library';
import { Slot } from 'react-plugin';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { PlaygroundContext } from '../../PlaygroundContext';
import { PlaygroundProvider } from '../../PlaygroundProvider';

// Plugins have side-effects: they register themselves
import '.';

import type {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';

afterEach(cleanup);

it('renders content from "root" slot', async () => {
  const { getByText } = renderPlayground();

  await waitForElement(() =>
    getByText(/content that will be shown alongside navigation/i)
  );
});

it('renders fixture list received from renderer', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      // TODO: Test other variations
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };

  const { getByText } = renderPlayground(
    <ReceiveRendererResponse msg={fixtureListMsg} />
  );

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sends fixtureSelect msg on fixture click', async () => {
  const fixtureListMsg = {
    type: 'fixtureList',
    payload: {
      rendererId: 'foo-renderer',
      // TODO: Test other variations
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };

  const rendererRequestHandler = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <ReceiveRendererResponse msg={fixtureListMsg} />
      <OnRendererRequest handler={rendererRequestHandler} />
    </>
  );

  fireEvent.click(await waitForElement(() => getByText(/zwei/i)));

  expect(rendererRequestHandler).toBeCalledWith({
    type: 'selectFixture',
    payload: {
      rendererId: RENDERER_ID,
      fixturePath: 'fixtures/zwei.js'
    }
  });
});

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="root">Content that will be shown alongside navigation</Slot>
      {otherNodes}
    </PlaygroundProvider>
  );
}

class ReceiveRendererResponse extends Component<{ msg: RendererResponse }> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    setTimeout(() => {
      this.context.receiveRendererResponse(this.props.msg);
    });
  }

  render() {
    return null;
  }
}

class OnRendererRequest extends Component<{
  handler: RendererRequest => mixed
}> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    this.context.onRendererRequest(this.props.handler);
  }

  render() {
    return null;
  }
}
