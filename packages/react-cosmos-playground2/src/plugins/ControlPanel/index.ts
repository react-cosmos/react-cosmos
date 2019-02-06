import { ComponentFixtureState } from 'react-cosmos-shared2/fixtureState';
import { RendererId } from 'react-cosmos-shared2/renderer';
import { createPlugin } from 'react-plugin';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { RouterSpec } from '../Router/public';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';

const { plug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel'
});

plug({
  slotName: 'right',
  render: ControlPanel,
  getProps: ({ getMethodsOf }) => {
    const router = getMethodsOf<RouterSpec>('router');
    const rendererCoordinator = getMethodsOf<RendererCoordinatorSpec>(
      'rendererCoordinator'
    );

    return {
      webUrl: rendererCoordinator.getWebUrl(),
      urlParams: router.getUrlParams(),
      connectedRendererIds: rendererCoordinator.getConnectedRendererIds(),
      primaryRendererId: rendererCoordinator.getPrimaryRendererId(),
      fixtureState: rendererCoordinator.getFixtureState(),
      setComponentsFixtureState: (components: ComponentFixtureState[]) => {
        rendererCoordinator.setFixtureState(fixtureState => ({
          ...fixtureState,
          components
        }));
      },
      selectPrimaryRenderer: (rendererId: RendererId) => {
        rendererCoordinator.selectPrimaryRenderer(rendererId);
      }
    };
  }
});

export { register };
