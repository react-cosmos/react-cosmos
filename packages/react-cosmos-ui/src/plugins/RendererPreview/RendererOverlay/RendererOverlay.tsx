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

  return null;
}
