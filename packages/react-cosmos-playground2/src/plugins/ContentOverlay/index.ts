import { PluginContext, createPlugin } from 'react-plugin';
import { ContentOverlay } from './ContentOverlay';
import { RouterSpec } from '../Router/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RendererPreviewSpec } from '../RendererPreview/public';
import { ContentOverlaySpec } from './public';

type Context = PluginContext<ContentOverlaySpec>;

const { plug, register } = createPlugin<ContentOverlaySpec>({
  name: 'contentOverlay'
});

plug({
  slotName: 'contentOverlay',
  render: ContentOverlay,
  getProps: getContentOverlayProps
});

export { register };

function getContentOverlayProps({ getMethodsOf }: Context) {
  const router = getMethodsOf<RouterSpec>('router');
  const fixtureSelected = router.getUrlParams().fixturePath !== undefined;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const rendererPreview = getMethodsOf<RendererPreviewSpec>('rendererPreview');

  return {
    fixtureSelected,
    validFixtureSelected:
      fixtureSelected && rendererCore.isValidFixtureSelected(),
    rendererConnected: rendererCore.isRendererConnected(),
    rendererPreviewUrlStatus: rendererPreview.getUrlStatus(),
    rendererPreviewRuntimeStatus: rendererPreview.getRuntimeStatus()
  };
}
