// @flow

import React from 'react';
import { render } from 'react-dom';
import { uuid } from 'react-cosmos-shared2/util';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures } from './user-modules-next';

const rendererId = uuid();

export function mount() {
  render(
    <PostMessage>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          rendererId={rendererId}
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
