// @flow

import { registerPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './onRendererRequest';
import { handleWindowMessages } from './handleWindowMessages';
import { RendererPreview } from './RendererPreview';

import type { RendererCoordinatorConfig } from '../RendererCoordinator';
import type { RendererPreviewState } from './shared';

export type { UrlStatus, RuntimeStatus, RendererPreviewState } from './shared';

export function register() {
  const { onRendererRequest, setIframeRef } = createRendererRequestHandler();

  const { init, on, plug } = registerPlugin<{}, RendererPreviewState>({
    name: 'rendererPreview',
    initialState: {
      urlStatus: 'unknown',
      runtimeStatus: 'pending'
    }
  });

  on('rendererCoordinator.request', onRendererRequest);

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
    getProps: context => getRendererPreviewProps(context, setIframeRef)
  });
}

function getRendererPreviewProps(context, onIframeRef) {
  return {
    rendererUrl: getRendererUrl(context),
    onIframeRef
  };
}

function getRendererUrl({ getConfigOf }) {
  const { webUrl }: RendererCoordinatorConfig = getConfigOf(
    'rendererCoordinator'
  );

  return webUrl;
}
