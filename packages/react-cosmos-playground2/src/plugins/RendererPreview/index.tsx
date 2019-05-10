import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './handleRendererRequests';
import { handleWindowMessages } from './handleWindowMessages';
import { RendererPreview } from './RendererPreview';
import { RendererPreviewSpec } from './public';
import { Context } from './shared';

const { postRendererRequest, setIframeRef } = createRendererRequestHandler();

const { onLoad, on, plug, register } = createPlugin<RendererPreviewSpec>({
  name: 'rendererPreview',
  initialState: {
    urlStatus: 'unknown',
    runtimeStatus: 'pending'
  },
  methods: {
    getUrlStatus,
    getRuntimeStatus
  }
});

on<RendererCoreSpec>('rendererCore', {
  request: postRendererRequest
});

onLoad((context: Context) => {
  const rendererUrl = getRendererUrl(context);

  if (!rendererUrl) {
    return null;
  }

  return [
    checkRendererStatus(context, rendererUrl),
    handleWindowMessages(context)
  ];
});

plug('rendererPreview', ({ pluginContext }) => {
  return (
    <RendererPreview
      rendererUrl={getRendererUrl(pluginContext)}
      onIframeRef={setIframeRef}
    />
  );
});

export { register };

function getUrlStatus({ getState }: Context) {
  return getState().urlStatus;
}

function getRuntimeStatus({ getState }: Context) {
  return getState().runtimeStatus;
}

function getRendererUrl({ getMethodsOf }: Context) {
  return getMethodsOf<CoreSpec>('core').getWebRendererUrl();
}
