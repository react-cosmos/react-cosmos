import { RendererId, RendererConnect } from 'react-cosmos-shared2/renderer';

let alreadyAdded = false;

export function addGlobalErrorHandler(
  rendererId: RendererId,
  rendererConnect: RendererConnect
) {
  if (alreadyAdded) {
    return;
  }

  alreadyAdded = true;
  window.addEventListener('error', () => {
    rendererConnect.postMessage({
      type: 'rendererError',
      payload: { rendererId }
    });
  });
}
