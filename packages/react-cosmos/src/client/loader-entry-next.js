/* eslint-env browser */
/* istanbul ignore file */
// @flow

import './react-devtools-hook';
import React from 'react';
import { render } from 'react-dom';
import { RENDERER_ID } from 'react-cosmos-shared2';
import { PostMessage, FixtureConnect } from 'react-cosmos-fixture';

function HelloWorld({ name }) {
  return <div>Hello {name}!</div>;
}

// TODO: ComponentState
const fixtures = {
  foo: <HelloWorld name="yo" />,
  bar: <HelloWorld name="ya" />,
  foobar: (
    <>
      <HelloWorld name="yo" />
      <HelloWorld name="ya" />
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
