import React from 'react';
import { RendererOverlayContainer } from '../../../components/ContentOverlay.js';
import { RendererNotResponding } from './RendererNotResponding.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';

export default {
  'renderer not responding': (
    <RendererOverlayContainer>
      <RendererNotResponding />
    </RendererOverlayContainer>
  ),

  'waiting for renderer': (
    <RendererOverlayContainer>
      <WaitingForRenderer />
    </RendererOverlayContainer>
  ),
};
