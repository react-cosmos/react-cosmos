import React from 'react';
import { RemoteRendererConnected } from './RemoteRendererConnected.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';

type Props = {
  rendererConnected: boolean;
};
export function RemoteRendererOverlay({ rendererConnected }: Props) {
  return rendererConnected ? (
    <RemoteRendererConnected />
  ) : (
    <WaitingForRenderer />
  );
}
