// @flow

import { registerPlugin } from 'react-plugin';
import { ControlPanel } from './ControlPanel';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { RouterState } from '../Router';
import type {
  RendererCoordinatorConfig,
  RendererCoordinatorState
} from '../RendererCoordinator';

export function register() {
  const { plug } = registerPlugin({
    name: 'controlPanel'
  });

  plug({
    slotName: 'right',
    render: ControlPanel,
    getProps: ({ getConfigOf, getStateOf, callMethod }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { webUrl }: RendererCoordinatorConfig = getConfigOf(
        'rendererCoordinator'
      );
      const {
        connectedRendererIds,
        primaryRendererId,
        fixtureState
      }: RendererCoordinatorState = getStateOf('rendererCoordinator');

      return {
        webUrl,
        urlParams,
        connectedRendererIds,
        primaryRendererId,
        fixtureState,
        setComponentsFixtureState: components => {
          callMethod('rendererCoordinator.setFixtureState', fixtureState => ({
            ...fixtureState,
            components
          }));
        },
        selectPrimaryRenderer: (rendererId: RendererId) => {
          callMethod('rendererCoordinator.selectPrimaryRenderer', rendererId);
        }
      };
    }
  });
}
