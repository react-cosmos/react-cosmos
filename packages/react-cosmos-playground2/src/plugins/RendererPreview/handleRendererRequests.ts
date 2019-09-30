import { Message } from 'react-cosmos-shared2/util';
import { RendererPreviewContext } from './shared';

export function createRendererRequestHandler() {
  let iframeRef: null | HTMLIFrameElement = null;

  function postRendererRequest(context: RendererPreviewContext, msg: Message) {
    if (iframeRef && iframeRef.contentWindow) {
      iframeRef.contentWindow.postMessage(msg, '*');
    }
  }

  function setIframeRef(ref: null | HTMLIFrameElement) {
    iframeRef = ref;
  }

  return { postRendererRequest, setIframeRef };
}
