// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, WebSockets, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures, decorators } from './userModules';
import { ErrorCatch } from './ErrorCatch';

import type { RendererId } from 'react-cosmos-shared2/renderer';

type Opts = {
  rendererId: RendererId,
  onFixtureChange?: () => mixed
};

export function mount(opts: Opts) {
  render(
    wrapSuitableAdaptor(createFixtureConnectRenderCb(opts)),
    getDomContainer()
  );
}

function wrapSuitableAdaptor(element) {
  if (isInsideIframe()) {
    return <PostMessage>{element}</PostMessage>;
  }

  return <WebSockets url={getWebSocketsUrl()}>{element}</WebSockets>;
}

function createFixtureConnectRenderCb({ rendererId, onFixtureChange }: Opts) {
  return ({ subscribe, unsubscribe, postMessage }) => (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      postMessage={postMessage}
      onFixtureChange={onFixtureChange}
    />
  );
}

function isInsideIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
