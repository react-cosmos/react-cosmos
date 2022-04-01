import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RendererPreviewSpec } from '../RendererPreview/spec.js';
import { RouterSpec } from '../Router/spec.js';
import { ContentOverlay } from './ContentOverlay.js';
import { ContentOverlaySpec } from './spec.js';
import { useWelcomeDismiss } from './welcomeDismiss.js';

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
