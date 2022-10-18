import { uuid } from '../utils/uuid.js';
import { RendererId } from '../renderer/types.js';

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
