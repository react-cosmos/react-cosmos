import React from 'react';
import { RuntimeStatus, UrlStatus } from '../RendererPreview/shared.js';
import { NoFixtureSelected } from './NoFixtureSelected.js';
import { RendererNotResponding } from './RendererNotResponding.js';
import { ContentContainer, OverlayContainer } from './shared.js';
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

  if (validFixtureSelected || rendererPreviewRuntimeStatus === 'error') {
    return null;
  }

  if (!rendererConnected) {
    // Delay "waiting for renderer" state to avoid rapidly changing visual
    // states when renderer is already compiled and will respond immediately
    return (
      <OverlayContainer data-testid="waiting">
        <ContentContainer />
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
