import * as React from 'react';
import styled from 'styled-components';
import {
  EmptyIllustration,
  DreamerIllustration
} from '../../shared/illustrations';
import { RendererNotResponding } from './RendererNotResponding';
import { WelcomeCosmosNext } from './WelcomeCosmosNext';
import { UrlStatus, RuntimeStatus } from '../RendererPreview/public';
import { IllustrationContainer } from './shared';

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
        <IllustrationContainer>
          <Delay>
            <DreamerIllustration title="waiting" />
          </Delay>
        </IllustrationContainer>
      </Container>
    );
  }

  if (fixtureSelected) {
    return (
      <Container data-testid="notFound">
        <IllustrationContainer>
          <EmptyIllustration title="not found" />
        </IllustrationContainer>
      </Container>
    );
  }

  return (
    <Container data-testid="blank">
      <WelcomeCosmosNext />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--grey6);
`;

const Delay = styled.div`
  opacity: 0;
  animation: fadeIn var(--quick) linear 0.3s forwards;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
