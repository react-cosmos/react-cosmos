// @flow

import React from 'react';
import { render } from 'react-dom';
import { uuid } from 'react-cosmos-shared2/util';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { PostMessage, WebSockets, FixtureConnect } from 'react-cosmos-fixture';
import { fixtures } from './user-modules-next';

const rendererId = getRendererId();

export function mount() {
  render(
    isInsideIframe() ? (
      <PostMessage>{renderFixtureConnect}</PostMessage>
    ) : (
      // TODO: Allow user to input URL
      <WebSockets url="localhost:8989">{renderFixtureConnect}</WebSockets>
    ),
    getDomContainer()
  );
}

function renderFixtureConnect({ subscribe, unsubscribe, postMessage }) {
  return (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
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

// Renderer ID is preserved to avoid announcing a new renderer when reloading
// the renderer window
function getRendererId() {
  let rendererId = localStorage.getItem('cosmosRendererId');

  if (!rendererId) {
    rendererId = uuid();
    localStorage.setItem('cosmosRendererId', rendererId);
  }

  return rendererId;
}
