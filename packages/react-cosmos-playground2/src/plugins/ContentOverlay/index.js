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
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { fixturePath = null } = urlParams;
      const primaryRendererState = callMethod(
        'renderer.getPrimaryRendererState'
      );
      const { urlStatus }: RendererPreviewState = getStateOf('rendererPreview');

      return {
        fixturePath,
        rendererReady: Boolean(primaryRendererState),
        rendererPreviewUrlStatus: urlStatus,
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
