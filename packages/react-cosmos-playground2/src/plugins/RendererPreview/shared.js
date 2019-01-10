// @flow

import type { IPluginContext } from 'react-plugin';

export type RendererStatus = 'waiting' | 'ok' | 'notResponding';

export type RendererPreviewState = {
  status: RendererStatus
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
