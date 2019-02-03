import { RendererRequest } from 'react-cosmos-shared2/renderer';
import { Context } from './shared';

export function createRendererRequestHandler() {
  let iframeRef: null | HTMLIFrameElement = null;

  function onRendererRequest(context: Context, msg: RendererRequest) {
    if (iframeRef && iframeRef.contentWindow) {
      iframeRef.contentWindow.postMessage(msg, '*');
    }
  }

  function setIframeRef(ref: null | HTMLIFrameElement) {
    iframeRef = ref;
  }

  return { onRendererRequest, setIframeRef };
}
