// @flow

import React from 'react';
import { render } from 'react-dom';
import { uuid } from 'react-cosmos-shared2/util';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, WebSockets, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures, decorators } from './user-modules-next';

const rendererId = getRendererId();

export function mount() {
  render(
    isInsideIframe() ? (
      <PostMessage>{renderFixtureConnect}</PostMessage>
    ) : (
      // TODO: Allow user to input URL
      <WebSockets url={location.origin}>{renderFixtureConnect}</WebSockets>
    ),
    getDomContainer()
  );
}

function renderFixtureConnect({ subscribe, unsubscribe, postMessage }) {
  return (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      decorators={decorators}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      postMessage={postMessage}
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
