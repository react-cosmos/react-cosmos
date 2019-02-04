import { IPluginContext, createPlugin } from 'react-plugin';
import { ContentOverlay } from './ContentOverlay';
import { RouterSpec } from '../Router/public';
import { RendererCoordinatorSpec } from '../RendererCoordinator/public';
import { RendererPreviewSpec } from '../RendererPreview/public';
import { ContentOverlaySpec } from './public';

type Context = IPluginContext<ContentOverlaySpec>;

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
  const { getUrlParams } = getMethodsOf<RouterSpec>('router');
  const { fixturePath } = getUrlParams();
  const fixtureSelected = fixturePath !== undefined;

  const rendererCoordinator = getMethodsOf<RendererCoordinatorSpec>(
    'rendererCoordinator'
  );
  const rendererConnected = rendererCoordinator.isRendererConnected();
  const validFixtureSelected =
    fixtureSelected && rendererCoordinator.isValidFixtureSelected();

  const rendererPreview = getMethodsOf<RendererPreviewSpec>('rendererPreview');
  const urlStatus = rendererPreview.getUrlStatus();
  const runtimeStatus = rendererPreview.getRuntimeStatus();

  return {
    fixtureSelected,
    validFixtureSelected,
    rendererConnected,
    rendererPreviewUrlStatus: urlStatus,
    rendererPreviewRuntimeStatus: runtimeStatus
  };
}
