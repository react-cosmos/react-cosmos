// @flow

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { RendererPreviewContext } from './shared';

export type { RendererPreviewUrlStatus, RendererPreviewState } from './shared';

export function createRendererRequestHandler() {
  let iframeRef: null | window = null;

  function handleRendererRequest(
    context: RendererPreviewContext,
    msg: RendererRequest
  ) {
    if (iframeRef) {
      iframeRef.contentWindow.postMessage(msg, '*');
    }
  }

  function setIframeRef(ref: null | window) {
    iframeRef = ref;
  }

  return { handleRendererRequest, setIframeRef };
}
