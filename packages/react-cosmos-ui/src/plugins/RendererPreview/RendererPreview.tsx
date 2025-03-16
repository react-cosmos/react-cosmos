import React from 'react';
import { createRendererUrl } from 'react-cosmos-core';
import { Slot } from 'react-plugin';
import styled from 'styled-components';
import { grey8 } from '../../style/colors.js';
import { RemoteRendererOverlay } from './RendererOverlay/RemoteRendererOverlay.js';
import { RendererOverlay } from './RendererOverlay/RendererOverlay.js';
import { RuntimeStatus } from './spec.js';

export type OnIframeRef = (elRef: null | HTMLIFrameElement) => void;

type Props = {
  rendererUrl: null | string;
  rendererConnected: boolean;
  runtimeStatus: RuntimeStatus;
  onIframeRef: OnIframeRef;
};
export const RendererPreview = React.memo(function RendererPreview({
  rendererUrl,
  rendererConnected,
  runtimeStatus,
  onIframeRef,
}: Props) {
  if (!rendererUrl) {
    // This code path is used when Cosmos is in React Native mode
    return (
      <Container bgColor={grey8}>
        <RemoteRendererOverlay rendererConnected={rendererConnected} />
      </Container>
    );
  }

  return (
    <Slot name="rendererPreviewOuter">
      <Container bgColor="#fff">
        <Iframe
          data-testid="previewIframe"
          ref={onIframeRef}
          src={createRendererUrl(rendererUrl)}
          allow="clipboard-write *; fullscreen *;"
        />
        <RendererOverlay runtimeStatus={runtimeStatus} />
      </Container>
    </Slot>
  );
});

const Container = styled.div<{ bgColor: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${props => props.bgColor};
`;

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
`;
