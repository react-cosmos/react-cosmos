// @flow

import { registerPlugin } from 'react-plugin';
import { ContentOverlay } from './ContentOverlay';

import type { RouterState } from '../Router';
import type { RendererPreviewState } from '../RendererPreview';

export function register() {
  const { plug } = registerPlugin({ name: 'contentOverlay' });

  plug({
    slotName: 'contentOverlay',
    render: ContentOverlay,
    getProps: getContentOverlayProps
  });
}

function getContentOverlayProps({ getStateOf, callMethod }) {
  const { urlParams }: RouterState = getStateOf('router');
  const { fixturePath = null } = urlParams;
  const rendererReady = callMethod('renderer.isReady');
  const { urlStatus }: RendererPreviewState = getStateOf('rendererPreview');
  const shouldShowRendererPreview = callMethod('rendererPreview.shouldShow');
  const validFixturePath = fixturePath
    ? callMethod('renderer.isValidFixturePath', fixturePath)
    : false;

  return {
    fixturePath,
    validFixturePath,
    rendererReady,
    rendererPreviewUrlStatus: urlStatus,
    shouldShowRendererPreview
  };
}
