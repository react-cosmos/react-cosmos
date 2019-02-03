import { createPlugin } from 'react-plugin';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './handleRendererRequests';
import { handleWindowMessages } from './handleWindowMessages';
import { OnIframeRef, RendererPreview } from './RendererPreview';
import { RendererPreviewSpec } from './public';
import { Context } from './shared';

const { onRendererRequest, setIframeRef } = createRendererRequestHandler();

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

on<RendererCoordinatorSpec>('rendererCoordinator', {
  request: onRendererRequest
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

plug({
  slotName: 'rendererPreview',
  render: RendererPreview,
  getProps: (context: Context) => getRendererPreviewProps(context, setIframeRef)
});

export { register };

function getUrlStatus({ getState }: Context) {
  return getState().urlStatus;
}

function getRuntimeStatus({ getState }: Context) {
  return getState().runtimeStatus;
}

function getRendererPreviewProps(context: Context, onIframeRef: OnIframeRef) {
  return {
    rendererUrl: getRendererUrl(context),
    onIframeRef
  };
}

function getRendererUrl({ getMethodsOf }: Context) {
  return getMethodsOf<RendererCoordinatorSpec>(
    'rendererCoordinator'
  ).getWebUrl();
}
