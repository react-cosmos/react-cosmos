import React from 'react';
import { RuntimeStatus, UrlStatus } from '../spec.js';
import { RendererNotResponding } from './RendererNotResponding.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';

type Props = {
  rendererPreviewUrlStatus: UrlStatus;
  rendererPreviewRuntimeStatus: RuntimeStatus;
};

export function RendererOverlay({
  rendererPreviewUrlStatus,
  rendererPreviewRuntimeStatus,
}: Props) {
  if (rendererPreviewUrlStatus === 'error') {
    return <RendererNotResponding />;
  }

  if (rendererPreviewRuntimeStatus === 'pending') {
    return <WaitingForRenderer />;
  }

  return null;
}
