// @flow

import type { IPluginContext } from 'react-plugin';

export type UrlStatus = 'unknown' | 'ok' | 'error';
export type RuntimeStatus = 'pending' | 'error' | 'connected';

export type RendererPreviewState = {
  urlStatus: UrlStatus,
  runtimeStatus: RuntimeStatus
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
