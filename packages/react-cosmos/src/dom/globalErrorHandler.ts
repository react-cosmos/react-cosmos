import {
  RendererId,
  RendererErrorResponse
} from 'react-cosmos-shared2/renderer';
import { isInsideIframe } from './shared';

let alreadyAdded = false;

export function addGlobalErrorHandler(rendererId: RendererId) {
  if (alreadyAdded) {
    return;
  }

  alreadyAdded = true;
  window.addEventListener('error', () => {
    postMessageToParentWindow({
      type: 'rendererError',
      payload: { rendererId }
    });
  });
}

function postMessageToParentWindow(msg: RendererErrorResponse) {
  // NOTE: Error messages are not sent from remote renderers, only from
  // iframe preview renderers
  if (isInsideIframe()) {
    parent.postMessage(msg, '*');
  }
}
