// @flow
/* eslint-env browser */

import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { RendererPreviewContext } from './shared';

export function handleWindowMessages(context: RendererPreviewContext) {
  const handler = createMessageHandler(context);
  window.addEventListener('message', handler, false);

  return () => {
    window.removeEventListener('message', handler, false);
  };
}

function createMessageHandler(context) {
  return msg => {
    if (!isValidResponse(msg)) {
      return;
    }

    const response: RendererResponse = msg.data;
    context.callMethod('renderer.receiveResponse', response);

    storeOwnRendererId(context, response);
  };
}

function isValidResponse(msg) {
  return (
    // TODO: Create convention to filter out alien messages reliably (eg.
    // maybe tag msgs with source: "cosmos")
    // https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
    !msg.data.source &&
    // TODO: Improve message validation
    msg.data.type &&
    msg.data.payload
  );
}

function storeOwnRendererId({ getState, setState }, response) {
  const { rendererId } = response.payload;

  if (getState().rendererId !== rendererId) {
    setState(state => ({ ...state, rendererId }));
  }
}
