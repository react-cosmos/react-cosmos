// @flow

import { uuid } from 'react-cosmos-shared2/util';

import type { RendererId } from 'react-cosmos-shared2/renderer';

// Renderer ID is remembered to avoid announcing a new renderer when reloading
// the renderer window. Note that each tab has creates a new session and thus
// a new rendererId.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
export function getRendererId(): RendererId {
  let rendererId = sessionStorage.getItem('cosmosRendererId');

  if (!rendererId) {
    rendererId = uuid();
    sessionStorage.setItem('cosmosRendererId', rendererId);
  }

  return rendererId;
}
