// @flow

import React from 'react';
import styled from 'styled-components';
import {
  BlankCanvasIllustration,
  EmptyIllustration,
  DreamerIllustration
} from '../../shared/illustrations';
import { RendererNotRespondingScreen } from './RendererNotRespondingScreen';
import { IllustrationContainer } from './shared';

import type { RendererPreviewUrlStatus } from '../RendererPreview';

type Props = {
  fixtureSelected: boolean,
  validFixtureSelected: boolean,
  rendererConnected: boolean,
  rendererPreviewUrlStatus: RendererPreviewUrlStatus,
  rendererPreviewVisible: boolean
};

export function ContentOverlay({
  fixtureSelected,
  validFixtureSelected,
  rendererConnected,
  rendererPreviewUrlStatus,
  rendererPreviewVisible
}: Props) {
  if (rendererPreviewVisible) {
    return null;
  }

  if (rendererPreviewUrlStatus === 'error') {
    return (
      <Container data-testid="rendererNotResponding">
        <RendererNotRespondingScreen />
      </Container>
    );
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

  if (!fixtureSelected) {
    return (
      <Container data-testid="blank">
        <IllustrationContainer>
          <BlankCanvasIllustration title="blank canvas" />
        </IllustrationContainer>
      </Container>
    );
  }

  if (!validFixtureSelected) {
    return (
      <Container data-testid="notFound">
        <IllustrationContainer>
          <EmptyIllustration title="not found" />
        </IllustrationContainer>
      </Container>
    );
  }

  // Nothing to show, whatever's underneath will be visible
  return null;
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
