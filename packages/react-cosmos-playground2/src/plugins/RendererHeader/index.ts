import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/public';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { RendererHeaderSpec } from './public';
import { RendererHeader } from './RendererHeader';

const { plug, register } = createPlugin<RendererHeaderSpec>({
  name: 'rendererHeader'
});

plug({
  slotName: 'rendererHeader',
  render: RendererHeader,
  getProps: ({ getMethodsOf }) => {
    const router = getMethodsOf<RouterSpec>('router');
    const rendererCoordinator = getMethodsOf<RendererCoordinatorSpec>(
      'rendererCoordinator'
    );

    return {
      urlParams: router.getUrlParams(),
      rendererConnected: rendererCoordinator.isRendererConnected(),
      validFixtureSelected: rendererCoordinator.isValidFixtureSelected(),
      setUrlParams: router.setUrlParams
    };
  }
});

export { register };
