/* eslint-env browser */
/* istanbul ignore file */
// @flow

import './react-devtools-hook';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import {
  PostMessage,
  FixtureConnect,
  ComponentState
} from 'react-cosmos-fixture';

function HelloWorld({ name }) {
  return <div>Hello {name}!</div>;
}

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;

    return (
      <button
        onClick={() => this.setState(({ count }) => ({ count: count + 1 }))}
      >
        {count} times
      </button>
    );
  }
}

const fixtures = {
  foo: <HelloWorld name="yo" />,
  bar: <HelloWorld name="ya" />,
  foobar: (
    <>
      <HelloWorld name="yo" />
      <HelloWorld name="ya" />
      <ComponentState>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </>
  )
};

mount();

function mount() {
  render(
    <PostMessage>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          rendererId={RENDERER_ID}
          fixtures={fixtures}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      )}
    </PostMessage>,
    getDomContainer()
  );
}

let container;

// TODO: Create abstraction in react-cosmos-shared2 and reuse in Playground2
function getDomContainer() {
  if (!container) {
    container = document.createElement('div');

    if (!document.body) {
      throw new Error(`document.body missing, can't mount Playground`);
    }

    document.body.appendChild(container);
  }

  return container;
}
