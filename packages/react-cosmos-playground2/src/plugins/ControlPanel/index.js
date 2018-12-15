// @flow

import { registerPlugin } from 'react-plugin';
import { ControlPanel } from './ControlPanel';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RouterState } from '../Router';
import type { RendererConfig, RendererState } from '../Renderer';

export function register() {
  const { pluginId, plug } = registerPlugin<RendererConfig, RendererState>({
    name: 'controlPanel'
  });

  plug({
    slotName: 'right',
    render: ControlPanel,
    getProps: ({ getConfigOf, getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { webUrl }: RendererConfig = getConfigOf('renderer');
      const rendererState: RendererState = getStateOf('renderer');

      return {
        webUrl,
        urlParams,
        rendererState,
        setComponentsFixtureState: components => {
          callMethod('renderer.setFixtureState', fixtureState => ({
            ...fixtureState,
            components
          }));
        },
        selectPrimaryRenderer: (rendererId: RendererId) => {
          callMethod('renderer.selectPrimaryRenderer', rendererId);
        }
      };
    }
  });

  return pluginId;
}
