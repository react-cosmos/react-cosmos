// @flow

import { registerPlugin } from 'react-plugin';
import { getPrimaryRendererState } from '../Renderer/selectors';
import { Nav } from './Nav';

import type { RendererState } from '../Renderer';
import type { RouterState } from '../Router';
import type { CoreConfig } from '../../index.js.flow';

export function register() {
  const { plug } = registerPlugin({ name: 'nav' });

  plug({
    slotName: 'left',
    render: Nav,
    getProps: ({ getConfigOf, getStateOf, callMethod }) => {
      const { projectId, fixturesDir }: CoreConfig = getConfigOf('playground');
      const rendererState: RendererState = getStateOf('renderer');
      const { urlParams }: RouterState = getStateOf('router');

      return {
        projectId,
        fixturesDir,
        urlParams,
        primaryRendererState: getPrimaryRendererState(rendererState),
        setUrlParams: newUrlParams => {
          callMethod('router.setUrlParams', newUrlParams);
        },
        storage: {
          getItem: key => callMethod('storage.getItem', key),
          setItem: (key, value) => callMethod('storage.setItem', key, value)
        }
      };
    }
  });
}
