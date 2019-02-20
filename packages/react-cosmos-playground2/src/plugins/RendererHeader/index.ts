import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/public';
import { RendererCoreSpec } from '../RendererCore/public';
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
    const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

    return {
      selectedFixtureId: router.getSelectedFixtureId(),
      fullScreen: router.isFullScreen(),
      rendererConnected: rendererCore.isRendererConnected(),
      validFixtureSelected: rendererCore.isValidFixtureSelected(),
      selectFixture: router.selectFixture,
      unselectFixture: router.unselectFixture
    };
  }
});

export { register };
