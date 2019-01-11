// @flow

import { registerPlugin } from 'react-plugin';
import { ContentOverlay } from './ContentOverlay';

import type { RouterState } from '../Router';

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

      return {
        fixturePath,
        rendererReady: Boolean(primaryRendererState),
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
