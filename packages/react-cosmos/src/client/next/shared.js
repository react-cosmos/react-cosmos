// @flow

export type RendererConfig = {
  containerQuerySelector?: string
};

declare var COSMOS_CONFIG: RendererConfig;

export const rendererConfig: RendererConfig = COSMOS_CONFIG;
