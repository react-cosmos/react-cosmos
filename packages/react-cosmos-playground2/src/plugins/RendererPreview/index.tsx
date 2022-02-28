import React from 'react';
import {
  CoreSpec,
  RendererCoreSpec,
  RendererPreviewSpec,
} from 'react-cosmos-shared2/ui';
import { createPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './handleRendererRequests';
import { handleWindowMessages } from './handleWindowMessages';
import { RendererPreview } from './RendererPreview';
import { RendererPreviewContext } from './shared';

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
      rendererUrl={getRendererUrl(pluginContext)}
      onIframeRef={handleIframeRef}
    />
  );
});

register();

function getUrlStatus({ getState }: RendererPreviewContext) {
  return getState().urlStatus;
}

function getRuntimeStatus({ getState }: RendererPreviewContext) {
  return getState().runtimeStatus;
}

function getRendererUrl({ getMethodsOf }: RendererPreviewContext) {
  return getMethodsOf<CoreSpec>('core').getWebRendererUrl();
}
