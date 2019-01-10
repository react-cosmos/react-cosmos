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
      const { compileError }: RendererPreviewState = getStateOf(
        'rendererPreview'
      );
      const primaryRendererState = callMethod(
        'renderer.getPrimaryRendererState'
      );

      return {
        urlParams,
        waitingForRenderer: !primaryRendererState,
        rendererPreviewCompileError: compileError,
        setUrlParams: newUrlParams =>
          callMethod('router.setUrlParams', newUrlParams),
        isValidFixturePath: fixturePath =>
          callMethod('renderer.isValidFixturePath', fixturePath)
      };
    }
  });
}
