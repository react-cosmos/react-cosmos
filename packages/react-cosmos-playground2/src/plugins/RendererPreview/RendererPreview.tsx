import React from 'react';
import { Slot } from 'react-plugin';
import styled from 'styled-components';
import { grey8, white3 } from '../../shared/ui/colors';

export type OnIframeRef = (elRef: null | HTMLIFrameElement) => void;

type Props = {
  rendererUrl: null | string;
  onIframeRef: OnIframeRef;
};

export const RendererPreview = React.memo(function RendererPreview({
  rendererUrl,
  onIframeRef
}: Props) {
  if (!rendererUrl) {
    return null;
  }

  return (
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
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${grey8};
  /* Checkerboard effect on background */
  background-image: linear-gradient(
      45deg,
      ${white3} 25%,
      transparent 25%,
      transparent 75%,
      ${white3} 75%,
      ${white3} 100%
    ),
    linear-gradient(
      45deg,
      ${white3} 25%,
      transparent 25%,
      transparent 75%,
      ${white3} 75%,
      ${white3} 100%
    );
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
`;

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
`;
