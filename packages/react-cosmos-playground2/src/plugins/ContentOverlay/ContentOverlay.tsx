import React from 'react';
import {
  DreamerIllustration,
  EmptyIllustration
} from '../../shared/illustrations';
import { RuntimeStatus, UrlStatus } from '../RendererPreview/public';
import { NoFixtureSelected } from './NoFixtureSelected';
import { RendererNotResponding } from './RendererNotResponding';
import {
  ContentContainer,
  Delay,
  IllustrationContainer,
  OverlayContainer
} from './shared';
import { WelcomeCosmosNext } from './WelcomeCosmosNext';

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
  onShowWelcome
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
        <ContentContainer>
          <IllustrationContainer>
            <Delay>
              <DreamerIllustration title="waiting" />
            </Delay>
          </IllustrationContainer>
        </ContentContainer>
      </OverlayContainer>
    );
  }

  if (fixtureSelected) {
    return (
      <OverlayContainer data-testid="notFound">
        <ContentContainer>
          <IllustrationContainer>
            <EmptyIllustration title="not found" />
          </IllustrationContainer>
        </ContentContainer>
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
      <WelcomeCosmosNext onDismissWelcome={onDismissWelcome} />
    </OverlayContainer>
  );
}
