import React from 'react';
import { RemoteRendererConnected } from './RemoteRendererConnected.js';
import { WaitingForRenderer } from './WaitingForRenderer.js';

export default {
  'waiting for renderer': <WaitingForRenderer />,

  'remote renderer connected': <RemoteRendererConnected />,
};
