// @flow

import type { IPluginContext } from 'react-plugin';

export type RendererPreviewUrlStatus = 'unknown' | 'ok' | 'error';

export type RendererPreviewState = {
  urlStatus: RendererPreviewUrlStatus,
  runtimeError: boolean
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
