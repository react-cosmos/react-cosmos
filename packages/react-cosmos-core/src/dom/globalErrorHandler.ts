import { rendererConnect } from './rendererConnect.js';
import { rendererId } from './rendererId.js';

window.addEventListener('error', () => {
  rendererConnect.postMessage({
    type: 'rendererError',
    payload: { rendererId },
  });
});
