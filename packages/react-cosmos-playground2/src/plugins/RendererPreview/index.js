// @flow

import { registerPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './handleRendererRequest';
import { handleWindowMessages } from './handleWindowMessages';
import { isVisible } from './isVisible';
import { handleRendererRuntimeErrors } from './handleRendererRuntimeErrors';
import { RendererPreview } from './RendererPreview';

import type { RendererConfig } from '../Renderer';
import type { RendererPreviewState } from './shared';

export type { RendererPreviewUrlStatus, RendererPreviewState } from './shared';

export function register() {
  const {
    handleRendererRequest,
    setIframeRef
  } = createRendererRequestHandler();

  const { init, on, method, plug } = registerPlugin<{}, RendererPreviewState>({
    name: 'rendererPreview',
    initialState: {
      urlStatus: 'unknown',
      runtimeError: false
    }
  });

  on('renderer.request', handleRendererRequest);

  // This method lets plugins that overlay the "rendererPreview" slot know when
  // to get out of the way
  method('isVisible', isVisible);

  init(context => {
    const rendererUrl = getRendererUrl(context);

    if (rendererUrl) {
      return [
        checkRendererStatus(context, rendererUrl),
        handleWindowMessages(context),
        handleRendererRuntimeErrors(context)
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
  const { webUrl }: RendererConfig = getConfigOf('renderer');

  return webUrl;
}
