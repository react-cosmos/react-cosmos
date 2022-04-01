import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/spec';
import { RendererPreviewSpec } from '../RendererPreview/spec';
import { RouterSpec } from '../Router/spec';
import { ContentOverlay } from './ContentOverlay';
import { ContentOverlaySpec } from './spec';
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
  const { welcomeDismissed, onDismissWelcome, onShowWelcome } =
    useWelcomeDismiss(pluginContext);

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
