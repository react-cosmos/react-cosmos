// @flow

import React from 'react';
import { render } from 'react-dom';
import qs from 'query-string';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures } from './user-modules-next';

export function mount() {
  const { f: initFixturePath } = qs.parse(location.search);

  render(
    <PostMessage>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          rendererId={RENDERER_ID}
          fixtures={fixtures}
          initFixturePath={initFixturePath}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      )}
    </PostMessage>,
    getDomContainer()
  );
}
