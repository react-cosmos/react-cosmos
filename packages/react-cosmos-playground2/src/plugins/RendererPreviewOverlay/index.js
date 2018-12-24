// @flow

import React from 'react';
import styled from 'styled-components';
import { registerPlugin } from 'react-plugin';
import { BlankCanvas } from '../../shared/illustrations';

import type { RouterState } from '../Router';

export function register() {
  const { plug } = registerPlugin({ name: 'rendererPreviewOverlay' });

  plug({
    slotName: 'rendererPreviewOverlay',
    render: RendererPreviewOverlay,
    getProps: ({ getStateOf }) => {
      const { urlParams }: RouterState = getStateOf('router');
      const { fixturePath = null } = urlParams;

      return {
        fixturePath
      };
    }
  });
}

type Props = {
  fixturePath: null | string
};

function RendererPreviewOverlay({ fixturePath }: Props) {
  return (
    !fixturePath && (
      <Container>
        <IllustrationContainer data-testid="blankCanvasIcon">
          <BlankCanvas />
        </IllustrationContainer>
      </Container>
    )
  );
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
