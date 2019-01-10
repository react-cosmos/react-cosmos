// @flow

import { registerPlugin } from 'react-plugin';
import { RendererPreviewOverlay } from './RendererPreviewOverlay';

import type { RouterState } from '../Router';
import type { RendererPreviewState } from '../RendererPreview';

export function register() {
  const { plug } = registerPlugin({ name: 'rendererPreviewOverlay' });

  plug({
    slotName: 'rendererPreviewOverlay',
    render: RendererPreviewOverlay,
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { status }: RendererPreviewState = getStateOf('rendererPreview');
      const { fixturePath = null } = urlParams;
      const primaryRendererState = callMethod(
        'renderer.getPrimaryRendererState'
      );

      return {
        fixturePath,
        rendererPreviewStatus: status,
        rendererReady: Boolean(primaryRendererState),
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
