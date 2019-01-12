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
  const { fixturePath } = urlParams;
  const fixtureSelected = fixturePath !== undefined;
  const validFixtureSelected =
    fixtureSelected && callMethod('renderer.isValidFixturePath', fixturePath);
  const rendererReady = callMethod('renderer.isReady');
  const { urlStatus }: RendererPreviewState = getStateOf('rendererPreview');
  const rendererPreviewVisible = callMethod('rendererPreview.isVisible');

  return {
    fixtureSelected,
    validFixtureSelected,
    rendererReady,
    rendererPreviewUrlStatus: urlStatus,
    rendererPreviewVisible
  };
}
