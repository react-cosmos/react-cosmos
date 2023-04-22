import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { checkRendererStatus } from './checkRendererStatus.js';
import { createRendererRequestHandler } from './handleRendererRequests.js';
import { handleWindowMessages } from './handleWindowMessages.js';
import { RendererPreview } from './RendererPreview.js';
import { RendererPreviewContext } from './shared.js';
import { RendererPreviewSpec } from './spec.js';

const { postRendererRequest, setIframeRef } = createRendererRequestHandler();

const { onLoad, on, plug, register } = createPlugin<RendererPreviewSpec>({
  name: 'rendererPreview',
  initialState: {
    urlStatus: 'unknown',
    runtimeStatus: 'pending',
  },
  methods: {
    getUrlStatus,
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

  return [
    checkRendererStatus(context, rendererUrl),
    handleWindowMessages(context),
  ];
});

plug('rendererPreview', ({ pluginContext }) => {
  function handleIframeRef(ref: null | HTMLIFrameElement) {
    setIframeRef(pluginContext, ref);
  }

  return (
    <RendererPreview
      urlStatus={pluginContext.getState().urlStatus}
      rendererUrl={getRendererUrl(pluginContext)}
      rendererConnected={getRendererConnected(pluginContext)}
      onIframeRef={handleIframeRef}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function getUrlStatus({ getState }: RendererPreviewContext) {
  return getState().urlStatus;
}

function getRuntimeStatus({ getState }: RendererPreviewContext) {
  return getState().runtimeStatus;
}

function getRendererUrl({ getMethodsOf }: RendererPreviewContext) {
  return getMethodsOf<CoreSpec>('core').getWebRendererUrl();
}

function getRendererConnected({ getMethodsOf }: RendererPreviewContext) {
  return getMethodsOf<RendererCoreSpec>('rendererCore').isRendererConnected();
}
