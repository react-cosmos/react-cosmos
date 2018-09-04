/* eslint-env browser */
// @flow

import './react-devtools-hook';
import React from 'react';
import { render } from 'react-dom';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { PostMessage, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures } from './user-modules-next';

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
      throw new Error(`document.body missing, can't mount renderer`);
    }

    document.body.appendChild(container);
  }

  return container;
}
