import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RendererPreview } from './RendererPreview.js';
import { createRendererRequestHandler } from './handleRendererRequests.js';
import { handleWindowMessages } from './handleWindowMessages.js';
import { RendererPreviewContext } from './shared.js';
import { RendererPreviewSpec } from './spec.js';

const { postRendererRequest, setIframeRef } = createRendererRequestHandler();

const { onLoad, on, plug, register } = createPlugin<RendererPreviewSpec>({
  name: 'rendererPreview',
  defaultConfig: {
    iframeBgColor: '#fff',
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
      iframeBgColor={pluginContext.getConfig().iframeBgColor}
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
