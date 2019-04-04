import {
  RendererId,
  RendererErrorResponse
} from 'react-cosmos-shared2/renderer';

export function initGlobalErrorHandler(rendererId: RendererId) {
  window.addEventListener('error', () => {
    postMessageToParentWindow({
      type: 'rendererError',
      payload: { rendererId }
    });
  });
}

function postMessageToParentWindow(msg: RendererErrorResponse) {
  parent.postMessage(msg, '*');
}
