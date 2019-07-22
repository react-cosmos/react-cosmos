import React from 'react';
import { createPlugin } from 'react-plugin';
import { ContentOverlay } from './ContentOverlay';
import { RouterSpec } from '../Router/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RendererPreviewSpec } from '../RendererPreview/public';
import { ContentOverlaySpec } from './public';
import { getWelcomeDismissState } from './welcomeDismissState';

const { plug, register } = createPlugin<ContentOverlaySpec>({
  name: 'contentOverlay'
});

plug('contentOverlay', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const router = getMethodsOf<RouterSpec>('router');
  const fixtureSelected = router.getSelectedFixtureId() !== null;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const rendererPreview = getMethodsOf<RendererPreviewSpec>('rendererPreview');
  const { welcomeDismissed, setWelcomeDismissed } = getWelcomeDismissState(
    pluginContext
  );
  const onDismissWelcome = React.useCallback(() => setWelcomeDismissed(true), [
    setWelcomeDismissed
  ]);
  const onShowWelcome = React.useCallback(() => setWelcomeDismissed(false), [
    setWelcomeDismissed
  ]);

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

export { register };
