import React from 'react';
import { createPlugin } from 'react-plugin';
import type { RendererCoreSpec } from '../RendererCore/spec.js';
import { createRendererRequestHandler } from './handleRendererRequests.js';
import { handleWindowMessages } from './handleWindowMessages.js';
import { RendererPreview } from './RendererPreview.js';
import type { RendererPreviewContext } from './shared.js';
import type { RendererPreviewSpec } from './spec.js';

const { postRendererRequest, setIframeRef } = createRendererRequestHandler();

const { onLoad, on, plug, register } = createPlugin<RendererPreviewSpec>({
  name: 'rendererPreview',
  defaultConfig: {
    backgroundColor: '#fff',
  },
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
      rendererConnected={getRendererConnected(pluginContext)}
      runtimeStatus={pluginContext.getState().runtimeStatus}
      backgroundColor={pluginContext.getConfig().backgroundColor}
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
  return getMethodsOf<RendererCoreSpec>('rendererCore').getRendererUrl();
}

function getRendererConnected({ getMethodsOf }: RendererPreviewContext) {
  return getMethodsOf<RendererCoreSpec>('rendererCore').isRendererConnected();
}
