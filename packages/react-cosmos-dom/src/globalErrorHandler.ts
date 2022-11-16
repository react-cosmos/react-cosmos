import { domRendererConnect } from './domRendererConnect.js';
import { domRendererId } from './domRendererId.js';

window.addEventListener('error', () => {
  domRendererConnect.postMessage({
    type: 'rendererError',
    payload: { rendererId: domRendererId },
  });
});
