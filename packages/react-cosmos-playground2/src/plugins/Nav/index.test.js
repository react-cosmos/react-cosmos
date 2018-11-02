// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import { render, cleanup, waitForElement } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';
import { PlaygroundProvider } from '../../PlaygroundProvider';

// Plugins have side-effects: they register themselves
import '.';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';

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

// TODO: sends fixtureSelect msg on fixture click

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
    }, 100);
  }

  render() {
    return null;
  }
}
