// @flow

import React from 'react';
import styled from 'styled-components';
import {
  BlankCanvasIllustration,
  EmptyIllustration,
  DreamerIllustration
} from '../../shared/illustrations';

import type { RendererPreviewUrlStatus } from '../RendererPreview';

type Props = {
  fixturePath: null | string,
  rendererReady: boolean,
  rendererPreviewUrlStatus: RendererPreviewUrlStatus,
  isValidFixturePath: string => boolean
};

export function ContentOverlay({
  fixturePath,
  rendererReady,
  rendererPreviewUrlStatus,
  isValidFixturePath
}: Props) {
  if (rendererPreviewUrlStatus === 'error') {
    return (
      <Container data-testid="rendererPreviewError">
        <p>Renderer not responding.</p>
        <p>
          1. Please check your terminal for errors. Your build might be broken.
        </p>
        <p>
          2. If you use a custom webpack config, maybe your build isn't
          generating an index.html page.
        </p>
        <a
          href="https://join-react-cosmos.now.sh"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ask for help
        </a>
      </Container>
    );
  }

  if (!rendererReady) {
    // Delay "waiting for renderer" state to avoid rapidly changing visual
    // states when renderer is already compiled and will respond immediately
    return (
      <Container data-testid="waiting">
        <IllustrationContainer>
          <Delay>
            <DreamerIllustration />
          </Delay>
        </IllustrationContainer>
      </Container>
    );
  }

  if (!fixturePath) {
    return (
      <Container data-testid="blank">
        <IllustrationContainer>
          <BlankCanvasIllustration />
        </IllustrationContainer>
      </Container>
    );
  }

  if (!isValidFixturePath(fixturePath)) {
    return (
      <Container data-testid="empty">
        <IllustrationContainer>
          <EmptyIllustration />
        </IllustrationContainer>
      </Container>
    );
  }

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

const IllustrationContainer = styled.div`
  --size: 256px;
  display: flex;
  width: var(--size);
  height: var(--size);
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
