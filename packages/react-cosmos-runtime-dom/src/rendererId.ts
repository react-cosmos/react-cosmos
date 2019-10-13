import { uuid } from 'react-cosmos-shared2/util';
import { RendererId } from 'react-cosmos-shared2/renderer';

export const rendererId = getRendererId();

// Renderer ID is remembered to avoid announcing a new renderer when reloading
// the renderer window. Note that each tab has creates a new session and thus
// a new rendererId.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
function getRendererId(): RendererId {
  let id = sessionStorage.getItem('cosmosRendererId');

  if (!id) {
    id = uuid();
    sessionStorage.setItem('cosmosRendererId', id);
  }

  return id;
}
