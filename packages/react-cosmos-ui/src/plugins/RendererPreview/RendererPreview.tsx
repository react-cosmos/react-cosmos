import React from 'react';
import { Slot } from 'react-plugin';
import styled from 'styled-components';
import { rendererBg } from '../../style/vars.js';
import { RendererOverlay } from './RendererOverlay/RendererOverlay.js';
import { WaitingForRenderer } from './RendererOverlay/WaitingForRenderer.js';
import { RuntimeStatus, UrlStatus } from './spec.js';

export type OnIframeRef = (elRef: null | HTMLIFrameElement) => void;

type Props = {
  rendererUrl: null | string;
  urlStatus: UrlStatus;
  runtimeStatus: RuntimeStatus;
  onIframeRef: OnIframeRef;
};

export const RendererPreview = React.memo(function RendererPreview({
  rendererUrl,
  urlStatus,
  runtimeStatus,
  onIframeRef,
}: Props) {
  if (!rendererUrl) {
    // This code path is used when Cosmos is in React Native mode
    return (
      <Container>
        {runtimeStatus === 'pending' && <WaitingForRenderer />}
      </Container>
    );
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
          rendererPreviewRuntimeStatus={runtimeStatus}
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
