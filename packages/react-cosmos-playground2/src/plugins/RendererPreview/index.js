// @flow

import { registerPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { handleWindowMessages } from './handleWindowMessages';
import { shouldShow } from './shouldShow';
import { RendererPreview } from './RendererPreview';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { RendererConfig } from '../Renderer';
import type { RendererPreviewState } from './shared';

export type { RendererPreviewUrlStatus, RendererPreviewState } from './shared';

let iframeRef: null | window = null;

export function register() {
  const { init, on, method, plug } = registerPlugin<{}, RendererPreviewState>({
    name: 'rendererPreview',
    initialState: {
      urlStatus: 'unknown',
      runtimeError: false
    }
  });

  on('renderer.request', handleRendererRequest);

  // This method tells plugins that overlay the "rendererPreview" slot when
  // to get out of the way
  method('shouldShow', shouldShow);

  init(context => {
    const rendererUrl = getRendererUrl(context);

    if (rendererUrl) {
      return [
        checkRendererStatus(context, rendererUrl),
        handleWindowMessages(context)
      ];
    }
  });

  plug({
    slotName: 'rendererPreview',
    render: RendererPreview,
    getProps: getRendererPreviewProps
  });
}

function getRendererPreviewProps(context) {
  return {
    rendererUrl: getRendererUrl(context),
    shouldShow: shouldShow(context),
    onIframeRef: elRef => {
      iframeRef = elRef;
    }
  };
}

function handleRendererRequest(context, msg: RendererRequest) {
  if (iframeRef) {
    iframeRef.contentWindow.postMessage(msg, '*');
  }
}

function getRendererUrl({ getConfigOf }) {
  const { webUrl }: RendererConfig = getConfigOf('renderer');

  return webUrl;
}
