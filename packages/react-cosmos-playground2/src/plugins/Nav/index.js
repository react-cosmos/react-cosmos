// @flow

import { registerPlugin } from 'react-plugin';
import { Nav } from './Nav';

import type { CoreConfig } from '../Core';
import type { RouterState } from '../Router';
import type { RendererCoordinatorState } from '../Renderer';

export function register() {
  const { plug } = registerPlugin({ name: 'nav' });

  plug({
    slotName: 'left',
    render: Nav,
    getProps: ({ getConfigOf, getStateOf, callMethod }) => {
      const {
        projectId,
        fixturesDir,
        fixtureFileSuffix
      }: CoreConfig = getConfigOf('core');
      const { urlParams }: RouterState = getStateOf('router');
      const { fixtures }: RendererCoordinatorState = getStateOf('renderer');

      return {
        projectId,
        fixturesDir,
        fixtureFileSuffix,
        urlParams,
        rendererConnected: callMethod('renderer.isRendererConnected'),
        fixtures,
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
