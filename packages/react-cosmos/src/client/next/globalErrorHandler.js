// @flow

import type {
  RendererId,
  RuntimeErrorResponse
} from 'react-cosmos-shared2/renderer';

export function initGlobalErrorHandler(rendererId: RendererId) {
  window.addEventListener('error', () => {
    postMessageToParentWindow({
      type: 'runtimeError',
      payload: { rendererId }
    });
  });
}

function postMessageToParentWindow(msg: RuntimeErrorResponse) {
  parent.postMessage(msg, '*');
}
