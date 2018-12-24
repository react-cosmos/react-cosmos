// @flow

import React from 'react';
import styled from 'styled-components';
import { BlankCanvas, Empty } from '../../shared/illustrations';

type Props = {
  fixturePath: null | string,
  isValidFixturePath: string => boolean
};

export function RendererPreviewOverlay({
  fixturePath,
  isValidFixturePath
}: Props) {
  if (!fixturePath) {
    return (
      <Container>
        <IllustrationContainer data-testid="blankCanvas">
          <BlankCanvas />
        </IllustrationContainer>
      </Container>
    );
  }

  if (!isValidFixturePath(fixturePath)) {
    return (
      <Container>
        <IllustrationContainer data-testid="empty">
          <Empty />
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
