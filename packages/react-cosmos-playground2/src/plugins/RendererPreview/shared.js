// @flow

import type { IPluginContext } from 'react-plugin';

export type RendererPreviewStatus = 'waiting' | 'ok' | 'notResponding';

export type RendererPreviewState = {
  status: RendererPreviewStatus
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
