/* eslint-env browser */
// @flow

import './react-devtools-hook';
import React from 'react';
import { render } from 'react-dom';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures } from './user-modules-next';

mount();

// TODO: HMR

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
