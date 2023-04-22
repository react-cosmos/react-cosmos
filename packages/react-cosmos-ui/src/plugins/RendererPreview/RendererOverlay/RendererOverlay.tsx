import React from 'react';
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
    return <RendererNotResponding />;
  }

  if (!rendererConnected) {
    return <WaitingForRenderer />;
  }

  return null;
}
