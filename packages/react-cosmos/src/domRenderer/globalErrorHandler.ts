import { rendererId } from './rendererId';
import { rendererConnect } from './rendererConnect';

window.addEventListener('error', () => {
  rendererConnect.postMessage({
    type: 'rendererError',
    payload: { rendererId }
  });
});
