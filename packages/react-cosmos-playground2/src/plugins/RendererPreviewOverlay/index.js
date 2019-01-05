// @flow

import { registerPlugin } from 'react-plugin';
import { RendererPreviewOverlay } from './RendererPreviewOverlay';

import type { RouterState } from '../Router';

export function register() {
  const { plug } = registerPlugin({ name: 'rendererPreviewOverlay' });

  plug({
    slotName: 'rendererPreviewOverlay',
    render: RendererPreviewOverlay,
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { fixturePath = null } = urlParams;
      const primaryRendererState = callMethod(
        'renderer.getPrimaryRendererState'
      );

      return {
        fixturePath,
        waitingForRenderer: !primaryRendererState,
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
