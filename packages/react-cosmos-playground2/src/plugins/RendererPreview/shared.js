// @flow

import type { IPluginContext } from 'react-plugin';
import type { RendererId } from 'react-cosmos-shared2/renderer';

export type RendererPreviewUrlStatus = 'unknown' | 'ok' | 'error';

export type RendererPreviewState = {
  urlStatus: RendererPreviewUrlStatus,
  // The renderer ID is collected when receiving the first message from the
  // renderer iframe
  rendererId: null | RendererId
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
