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

  init(({ getConfigOf, callMethod }) => {
    const { webUrl }: RendererConfig = getConfigOf('renderer');

    if (!webUrl) {
      return;
    }

    // Defining plugin parts inside handlers sounds like a bad idea in general.
    // I'm making an exception in this case because renderer requests (the
    // only event this plugin listens to at the moment of this writing) sent
    // from other plugins' init handlers would be ignored anyway, since renderer
    // requests can only be honored once the iframe element ref is available.
    plug({
      slotName: 'rendererPreview',
      render: (
        <Slot name="rendererPreviewOuter">
          <RendererPreview
            rendererUrl={webUrl}
            onIframeRef={elRef => {
              iframeRef = elRef;
            }}
          />
        </Slot>
      )
    });

    function handleWindowMsg(msg: Object) {
      // TODO: Create convention to filter out alien messages reliably (eg.
      // maybe tag msgs with source: "cosmos")
      // TODO: https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
      if (msg.data.source) {
        return;
      }

      callMethod('renderer.receiveResponse', msg.data);
    }

    window.addEventListener('message', handleWindowMsg, false);

    return () => {
      window.removeEventListener('message', handleWindowMsg, false);
    };
  });
}

function handleRendererRequest(context, msg: RendererRequest) {
  if (iframeRef) {
    iframeRef.contentWindow.postMessage(msg, '*');
  }
}
