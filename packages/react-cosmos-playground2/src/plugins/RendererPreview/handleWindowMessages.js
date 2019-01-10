// @flow
/* eslint-env browser */

import type { RendererPreviewContext } from './shared';

export function handleWindowMessages(context: RendererPreviewContext) {
  function handleMessage(msg: Object) {
    // TODO: Create convention to filter out alien messages reliably (eg.
    // maybe tag msgs with source: "cosmos")
    // TODO: https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
    if (msg.data.source) {
      return;
    }

    context.callMethod('renderer.receiveResponse', msg.data);
  }

  window.addEventListener('message', handleMessage, false);

  return () => {
    window.removeEventListener('message', handleMessage, false);
  };
}
