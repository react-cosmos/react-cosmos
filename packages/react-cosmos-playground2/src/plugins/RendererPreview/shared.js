// @flow

import type { IPluginContext } from 'react-plugin';

export type RendererPreviewState = {
  compileError: boolean
};

export type RendererPreviewContext = IPluginContext<{}, RendererPreviewState>;
