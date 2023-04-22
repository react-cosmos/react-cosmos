import React from 'react';
import { OverlayContainer } from '../../../components/ContentOverlay.js';
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
      <OverlayContainer data-testid="rendererNotResponding">
        <RendererNotResponding />
      </OverlayContainer>
    );
  }

  if (!rendererConnected) {
    return (
      <OverlayContainer data-testid="waitingForRenderer">
        <WaitingForRenderer />
      </OverlayContainer>
    );
  }

  return null;
}
