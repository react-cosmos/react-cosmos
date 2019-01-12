// @flow
/* eslint-env browser */

import { resetErrorState } from './handleRendererRuntimeErrors';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { RendererPreviewContext } from './shared';

export function handleWindowMessages(context: RendererPreviewContext) {
  function handleMessage(msg: Object) {
    // TODO: Create convention to filter out alien messages reliably (eg.
    // maybe tag msgs with source: "cosmos")
    // https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
    if (msg.data.source || !msg.data.type) {
      return;
    }

    // TODO: Validate message
    const response: RendererResponse = msg.data;
    context.callMethod('renderer.receiveResponse', response);

    // A message from the renderer indicates that any previous renderer error
    // has been resolved (probably due to "hot module reloading")
    if (
      hasRuntimeError(context) &&
      doesResponseInvalidateErrorState(response)
    ) {
      resetErrorState(context);
    }
  }

  window.addEventListener('message', handleMessage, false);

  return () => {
    window.removeEventListener('message', handleMessage, false);
  };
}

function hasRuntimeError({ getState }) {
  return getState().runtimeError;
}

function doesResponseInvalidateErrorState(r: RendererResponse) {
  return r.type === 'rendererReady' || r.type === 'fixtureListUpdate';
}
