// @flow

import React from 'react';
import { registerPlugin, Slot } from 'react-plugin';
import { RendererPreview } from './RendererPreview';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { RendererConfig } from '../Renderer';

let iframeRef: null | window = null;

export function register() {
  const { init, on, plug } = registerPlugin({ name: 'rendererPreview' });

  on('renderer.request', handleRendererRequest);

  init(context => {
    if (!getRendererUrl(context)) {
      return;
    }

    function handleWindowMsg(msg: Object) {
      // TODO: Create convention to filter out alien messages reliably (eg.
      // maybe tag msgs with source: "cosmos")
      // TODO: https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
      if (msg.data.source) {
        return;
      }

      context.callMethod('renderer.receiveResponse', msg.data);
    }

    window.addEventListener('message', handleWindowMsg, false);

    return () => {
      window.removeEventListener('message', handleWindowMsg, false);
    };
  });

  plug({
    slotName: 'rendererPreview',
    render: ({ rendererUrl }) =>
      rendererUrl && (
        <Slot name="rendererPreviewOuter">
          <RendererPreview
            rendererUrl={rendererUrl}
            onIframeRef={elRef => {
              iframeRef = elRef;
            }}
          />
        </Slot>
      ),
    getProps: context => {
      return {
        rendererUrl: getRendererUrl(context)
      };
    }
  });
}

function getRendererUrl({ getConfigOf }) {
  const { webUrl }: RendererConfig = getConfigOf('renderer');

  return webUrl;
}

function handleRendererRequest(context, msg: RendererRequest) {
  if (iframeRef) {
    iframeRef.contentWindow.postMessage(msg, '*');
  }
}
