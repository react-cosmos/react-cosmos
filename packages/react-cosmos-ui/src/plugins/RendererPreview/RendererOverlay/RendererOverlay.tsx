import React from 'react';
import { OverlayContainer } from '../../../components/ContentOverlay.js';
import { UrlStatus } from '../spec.js';
import { RendererNotResponding } from './RendererNotResponding.js';

type Props = {
  rendererPreviewUrlStatus: UrlStatus;
};

export function RendererOverlay({ rendererPreviewUrlStatus }: Props) {
  if (rendererPreviewUrlStatus === 'error') {
    return (
      <OverlayContainer data-testid="rendererNotResponding">
        <RendererNotResponding />
      </OverlayContainer>
    );
  }

  return null;
}
