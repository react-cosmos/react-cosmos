import React from 'react';
import { RuntimeStatus } from '../spec.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';

type Props = {
  runtimeStatus: RuntimeStatus;
};
export function RendererOverlay({ runtimeStatus }: Props) {
  if (runtimeStatus === 'pending') {
    return <WaitingForRenderer />;
  }

  // No render overlay is shown in both "connected" and "error" states. In the
  // latter case, the renderer will communicate the error using its own
  // framework-specific UI.
  return null;
}
