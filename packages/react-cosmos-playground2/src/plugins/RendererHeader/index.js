// @flow

import { registerPlugin } from 'react-plugin';
import { RendererHeader } from './RendererHeader';

import type { RouterState } from '../Router';

export function register() {
  const { plug } = registerPlugin({ name: 'rendererHeader' });

  plug({
    slotName: 'rendererHeader',
    render: RendererHeader,
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');

      return {
        urlParams,
        rendererConnected: callMethod('renderer.isRendererConnected'),
        validFixtureSelected: callMethod('renderer.isValidFixtureSelected'),
        setUrlParams: newUrlParams =>
          callMethod('router.setUrlParams', newUrlParams)
      };
    }
  });
}
