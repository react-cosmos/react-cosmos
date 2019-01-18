// @flow

import { registerPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './onRendererRequest';
import { handleWindowMessages } from './handleWindowMessages';
import { isVisible } from './isVisible';
import { RendererPreview } from './RendererPreview';

import type { RendererCoordinatorConfig } from '../RendererCoordinator';
import type { RendererPreviewState } from './shared';

export type { UrlStatus, RendererPreviewState } from './shared';

export function register() {
  const { onRendererRequest, setIframeRef } = createRendererRequestHandler();

  const { init, on, method, plug } = registerPlugin<{}, RendererPreviewState>({
    name: 'rendererPreview',
    initialState: {
      urlStatus: 'unknown',
      runtimeStatus: 'pending'
    }
  });

  on('rendererCoordinator.request', onRendererRequest);

  // This method lets plugins that overlay the "rendererPreview" slot know when
  // to get out of the way
  method('isVisible', isVisible);

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
    isVisible: isVisible(context),
    onIframeRef
  };
}

function getRendererUrl({ getConfigOf }) {
  const { webUrl }: RendererCoordinatorConfig = getConfigOf(
    'rendererCoordinator'
  );

  return webUrl;
}
