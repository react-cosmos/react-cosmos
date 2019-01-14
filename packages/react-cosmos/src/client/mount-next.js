// @flow

import React from 'react';
import { render } from 'react-dom';
import { uuid } from 'react-cosmos-shared2/util';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, WebSockets, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures, decorators } from './user-modules-next';

const rendererId = getRendererId();

type Opts = {
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

function createFixtureConnectRenderCb({ onFixtureChange }: Opts) {
  return ({ subscribe, unsubscribe, postMessage }) => (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      systemDecorators={[]}
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

// Renderer ID is remembered to avoid announcing a new renderer when reloading
// the renderer window. Note that each tab has creates a new session and thus
// a new rendererId.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
function getRendererId() {
  let rendererId = sessionStorage.getItem('cosmosRendererId');

  if (!rendererId) {
    rendererId = uuid();
    sessionStorage.setItem('cosmosRendererId', rendererId);
  }

  return rendererId;
}

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
