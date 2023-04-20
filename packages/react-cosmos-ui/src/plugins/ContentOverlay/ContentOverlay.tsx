import React from 'react';
import { RuntimeStatus, UrlStatus } from '../RendererPreview/shared.js';
import { NoFixtureSelected } from './NoFixtureSelected.js';
import { RendererNotResponding } from './RendererNotResponding.js';
import { ContentContainer, OverlayContainer } from './shared.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';
import { WelcomeCosmos } from './WelcomeCosmos.js';

type Props = {
  fixtureSelected: boolean;
  validFixtureSelected: boolean;
  rendererConnected: boolean;
  rendererPreviewUrlStatus: UrlStatus;
  rendererPreviewRuntimeStatus: RuntimeStatus;
  welcomeDismissed: boolean;
  onDismissWelcome: () => unknown;
  onShowWelcome: () => unknown;
};

export function ContentOverlay({
  fixtureSelected,
  validFixtureSelected,
  rendererConnected,
  rendererPreviewUrlStatus,
  rendererPreviewRuntimeStatus,
  welcomeDismissed,
  onDismissWelcome,
  onShowWelcome,
}: Props) {
  if (rendererPreviewUrlStatus === 'error') {
    return (
      <OverlayContainer data-testid="rendererNotResponding">
        <RendererNotResponding />
      </OverlayContainer>
    );
  }

  if (
    (rendererConnected && validFixtureSelected) ||
    rendererPreviewRuntimeStatus === 'error'
  ) {
    // Usually the content overlay is only hidden when a valid fixture is
    // selected and the renderer connected. However, when the renderer is in
    // error state, we also hide the content overlay to avoid showing a blank
    // screen and to uncover the error message.
    return null;
  }

  if (!rendererConnected) {
    // Delay "waiting for renderer" state to avoid rapidly changing visual
    // states when renderer is already compiled and will respond immediately
    return (
      <OverlayContainer data-testid="waiting">
        <WaitingForRenderer />
      </OverlayContainer>
    );
  }

  if (fixtureSelected) {
    return (
      <OverlayContainer data-testid="notFound">
        <ContentContainer />
      </OverlayContainer>
    );
  }

  if (welcomeDismissed) {
    return (
      <OverlayContainer data-testid="blank">
        <NoFixtureSelected onShowWelcome={onShowWelcome} />
      </OverlayContainer>
    );
  }

  return (
    <OverlayContainer data-testid="welcome">
      <WelcomeCosmos onDismissWelcome={onDismissWelcome} />
    </OverlayContainer>
  );
}
