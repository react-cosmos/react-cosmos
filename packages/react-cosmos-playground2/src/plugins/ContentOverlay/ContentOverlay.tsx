import React from 'react';
import {
  EmptyIllustration,
  DreamerIllustration
} from '../../shared/illustrations';
import { RendererNotResponding } from './RendererNotResponding';
import { WelcomeCosmosNext } from './WelcomeCosmosNext';
import { UrlStatus, RuntimeStatus } from '../RendererPreview/public';
import {
  IllustrationContainer,
  Container,
  ContentContainer,
  Delay
} from './shared';

type Props = {
  fixtureSelected: boolean;
  validFixtureSelected: boolean;
  rendererConnected: boolean;
  rendererPreviewUrlStatus: UrlStatus;
  rendererPreviewRuntimeStatus: RuntimeStatus;
};

export function ContentOverlay({
  fixtureSelected,
  validFixtureSelected,
  rendererConnected,
  rendererPreviewUrlStatus,
  rendererPreviewRuntimeStatus
}: Props) {
  if (rendererPreviewUrlStatus === 'error') {
    return (
      <Container data-testid="rendererNotResponding">
        <RendererNotResponding />
      </Container>
    );
  }

  if (validFixtureSelected || rendererPreviewRuntimeStatus === 'error') {
    return null;
  }

  if (!rendererConnected) {
    // Delay "waiting for renderer" state to avoid rapidly changing visual
    // states when renderer is already compiled and will respond immediately
    return (
      <Container data-testid="waiting">
        <ContentContainer>
          <IllustrationContainer>
            <Delay>
              <DreamerIllustration title="waiting" />
            </Delay>
          </IllustrationContainer>
        </ContentContainer>
      </Container>
    );
  }

  if (fixtureSelected) {
    return (
      <Container data-testid="notFound">
        <ContentContainer>
          <IllustrationContainer>
            <EmptyIllustration title="not found" />
          </IllustrationContainer>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container data-testid="blank">
      <WelcomeCosmosNext />
    </Container>
  );
}
