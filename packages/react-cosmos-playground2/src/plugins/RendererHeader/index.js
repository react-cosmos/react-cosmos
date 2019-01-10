// @flow

import { registerPlugin } from 'react-plugin';
import { RendererHeader } from './RendererHeader';

import type { RouterState } from '../Router';
import type { RendererPreviewState } from '../RendererPreview';

export function register() {
  const { plug } = registerPlugin({ name: 'rendererHeader' });

  plug({
    slotName: 'rendererHeader',
    render: RendererHeader,
    getProps: ({ getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { status }: RendererPreviewState = getStateOf('rendererPreview');

      return {
        urlParams,
        rendererPreviewStatus: status,
        setUrlParams: newUrlParams =>
          callMethod('router.setUrlParams', newUrlParams),
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
