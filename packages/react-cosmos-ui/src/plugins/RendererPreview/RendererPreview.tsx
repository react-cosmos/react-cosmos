import React from 'react';
import { Slot } from 'react-plugin';
import styled from 'styled-components';
import { rendererBg } from '../../style/colors.js';
import { RendererOverlay } from './RendererOverlay/RendererOverlay.js';
import { UrlStatus } from './spec.js';

export type OnIframeRef = (elRef: null | HTMLIFrameElement) => void;

type Props = {
  urlStatus: UrlStatus;
  rendererUrl: null | string;
  rendererConnected: boolean;
  onIframeRef: OnIframeRef;
};

export const RendererPreview = React.memo(function RendererPreview({
  urlStatus,
  rendererUrl,
  rendererConnected,
  onIframeRef,
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
          allow="clipboard-write *"
        />
        <RendererOverlay
          rendererPreviewUrlStatus={urlStatus}
          rendererConnected={rendererConnected}
        />
      </Container>
    </Slot>
  );
});

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-image: ${rendererBg};
`;

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
`;
