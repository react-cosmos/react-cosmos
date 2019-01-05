// @flow

import React from 'react';
import styled from 'styled-components';
import {
  BlankCanvasIllustration,
  EmptyIllustration,
  DreamerIllustration
} from '../../shared/illustrations';

type Props = {
  fixturePath: null | string,
  isValidFixturePath: string => boolean,
  waitingForRenderer: boolean
};

export function RendererPreviewOverlay({
  fixturePath,
  waitingForRenderer,
  isValidFixturePath
}: Props) {
  if (waitingForRenderer) {
    // Delay "waiting for renderer" state to avoid rapidly changing visual
    // states when renderer is already compiled and will respond immediately
    return (
      <Container>
        <IllustrationContainer data-testid="waiting">
          <Delay>
            <DreamerIllustration />
          </Delay>
        </IllustrationContainer>
      </Container>
    );
  }

  if (!fixturePath) {
    return (
      <Container>
        <IllustrationContainer data-testid="blank">
          <BlankCanvasIllustration />
        </IllustrationContainer>
      </Container>
    );
  }

  if (!isValidFixturePath(fixturePath)) {
    return (
      <Container>
        <IllustrationContainer data-testid="empty">
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--grey6);
`;

const IllustrationContainer = styled.div`
  --size: 256px;
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
