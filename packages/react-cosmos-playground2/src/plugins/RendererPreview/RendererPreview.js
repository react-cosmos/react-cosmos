// @flow

import styled from 'styled-components';
import React from 'react';
import { Slot } from 'react-plugin';

type Props = {
  rendererUrl: null | string,
  onIframeRef: (elRef: null | window) => void
};

export function RendererPreview({ rendererUrl, onIframeRef }: Props) {
  return (
    rendererUrl && (
      <Slot name="rendererPreviewOuter">
        <Container>
          <Iframe
            data-testid="previewIframe"
            ref={onIframeRef}
            src={rendererUrl}
            frameBorder={0}
          />
        </Container>
      </Slot>
    )
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  /* Checkerboard effect on background */
  background-image: linear-gradient(
      45deg,
      var(--grey7) 25%,
      transparent 25%,
      transparent 75%,
      var(--grey7) 75%,
      var(--grey7) 100%
    ),
    linear-gradient(
      45deg,
      var(--grey7) 25%,
      transparent 25%,
      transparent 75%,
      var(--grey7) 75%,
      var(--grey7) 100%
    );
  background-size: 50px 50px;
  background-position: 0 0, 25px 25px;
`;

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
`;
