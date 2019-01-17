// @flow

import { registerPlugin } from 'react-plugin';
import { ControlPanel } from './ControlPanel';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RouterState } from '../Router';
import type { RendererConfig, RendererCoordinatorState } from '../Renderer';

export function register() {
  const { plug } = registerPlugin({
    name: 'controlPanel'
  });

  plug({
    slotName: 'right',
    render: ControlPanel,
    getProps: ({ getConfigOf, getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { webUrl }: RendererConfig = getConfigOf('renderer');
      const {
        connectedRendererIds,
        primaryRendererId,
        fixtureState
      }: RendererCoordinatorState = getStateOf('renderer');

      return {
        webUrl,
        urlParams,
        connectedRendererIds,
        primaryRendererId,
        fixtureState,
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
}
