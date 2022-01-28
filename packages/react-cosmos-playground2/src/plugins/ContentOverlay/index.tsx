import React from 'react';
import { createPlugin } from 'react-plugin';
import { ContentOverlay } from './ContentOverlay';
import { RouterSpec } from '../Router/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RendererPreviewSpec } from '../RendererPreview/public';
import { ContentOverlaySpec } from './public';
import { useWelcomeDismiss } from './welcomeDismiss';

const { plug, register } = createPlugin<ContentOverlaySpec>({
  name: 'contentOverlay',
});

plug('contentOverlay', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const router = getMethodsOf<RouterSpec>('router');
  const fixtureSelected = router.getSelectedFixtureId() !== null;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const rendererPreview = getMethodsOf<RendererPreviewSpec>('rendererPreview');
  const {
    welcomeDismissed,
    onDismissWelcome,
    onShowWelcome,
  } = useWelcomeDismiss(pluginContext);

  return (
    <ContentOverlay
      fixtureSelected={fixtureSelected}
      validFixtureSelected={
        fixtureSelected && rendererCore.isValidFixtureSelected()
      }
      rendererConnected={rendererCore.isRendererConnected()}
      rendererPreviewUrlStatus={rendererPreview.getUrlStatus()}
      rendererPreviewRuntimeStatus={rendererPreview.getRuntimeStatus()}
      welcomeDismissed={welcomeDismissed}
      onDismissWelcome={onDismissWelcome}
      onShowWelcome={onShowWelcome}
    />
  );
});

register();
