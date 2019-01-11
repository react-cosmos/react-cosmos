// @flow

import React from 'react';
import styled from 'styled-components';
import {
  BlankCanvasIllustration,
  EmptyIllustration,
  DreamerIllustration
} from '../../shared/illustrations';
import { RendererPreviewUrlError } from './RendererPreviewUrlError';

import type { RendererPreviewUrlStatus } from '../RendererPreview';

type Props = {
  fixturePath: null | string,
  validFixturePath: boolean,
  rendererReady: boolean,
  rendererPreviewUrlStatus: RendererPreviewUrlStatus,
  rendererPreviewVisible: boolean
};

export function ContentOverlay({
  fixturePath,
  validFixturePath,
  rendererReady,
  rendererPreviewUrlStatus,
  rendererPreviewVisible
}: Props) {
  if (rendererPreviewVisible) {
    return null;
  }

  if (rendererPreviewUrlStatus === 'error') {
    return (
      <Container data-testid="rendererPreviewError">
        <RendererPreviewUrlError />
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

  if (fixturePath && !validFixturePath) {
    return (
      <Container data-testid="empty">
        <IllustrationContainer>
          <EmptyIllustration />
        </IllustrationContainer>
      </Container>
    );
  }

  return (
    <Container data-testid="blank">
      <IllustrationContainer>
        <BlankCanvasIllustration />
      </IllustrationContainer>
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
