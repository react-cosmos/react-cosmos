// @flow

import type { IPluginContext } from 'react-plugin';

export type UrlStatus = 'unknown' | 'ok' | 'error';
export type RuntimeStatus = 'pending' | 'connected' | 'error';

export type RendererPreviewState = {
  urlStatus: UrlStatus,
  runtimeStatus: RuntimeStatus
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
