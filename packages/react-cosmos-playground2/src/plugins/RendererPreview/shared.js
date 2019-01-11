// @flow

import type { IPluginContext } from 'react-plugin';

export type RendererPreviewUrlStatus = 'unknown' | 'ok' | 'error';

export type RendererPreviewState = {
  urlStatus: RendererPreviewUrlStatus
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
