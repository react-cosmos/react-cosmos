import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { createRendererRequestHandler } from './handleRendererRequests.js';
import { handleWindowMessages } from './handleWindowMessages.js';
import { RendererPreview } from './RendererPreview.js';
import { RendererPreviewContext } from './shared.js';
import { RendererPreviewSpec } from './spec.js';

const { postRendererRequest, setIframeRef } = createRendererRequestHandler();

const { onLoad, on, plug, register } = createPlugin<RendererPreviewSpec>({
  name: 'rendererPreview',
  initialState: {
    runtimeStatus: 'pending',
  },
  methods: {
    getRuntimeStatus,
  },
});

on<RendererCoreSpec>('rendererCore', {
  request: postRendererRequest,
});

onLoad((context: RendererPreviewContext) => {
  const rendererUrl = getRendererUrl(context);

  if (!rendererUrl) {
    return null;
  }

  return [handleWindowMessages(context)];
});

plug('rendererPreview', ({ pluginContext }) => {
  function handleIframeRef(ref: null | HTMLIFrameElement) {
    setIframeRef(pluginContext, ref);
  }

  return (
    <RendererPreview
      rendererUrl={getRendererUrl(pluginContext)}
      runtimeStatus={pluginContext.getState().runtimeStatus}
      onIframeRef={handleIframeRef}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function getRuntimeStatus({ getState }: RendererPreviewContext) {
  return getState().runtimeStatus;
}

function getRendererUrl({ getMethodsOf }: RendererPreviewContext) {
  return getMethodsOf<CoreSpec>('core').getWebRendererUrl();
}
