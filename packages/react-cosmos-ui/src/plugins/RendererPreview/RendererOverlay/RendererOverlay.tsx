import React from 'react';
import { RendererOverlayContainer } from '../../../components/ContentOverlay.js';
import { UrlStatus } from '../spec.js';
import { RendererNotResponding } from './RendererNotResponding.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';

type Props = {
  rendererConnected: boolean;
  rendererPreviewUrlStatus: UrlStatus;
};

export function RendererOverlay({
  rendererPreviewUrlStatus,
  rendererConnected,
}: Props) {
  if (rendererPreviewUrlStatus === 'error') {
    return (
      <RendererOverlayContainer data-testid="rendererNotResponding">
        <RendererNotResponding />
      </RendererOverlayContainer>
    );
  }

  if (!rendererConnected) {
    return (
      <RendererOverlayContainer data-testid="waitingForRenderer">
        <WaitingForRenderer />
      </RendererOverlayContainer>
    );
  }

  return null;
}
