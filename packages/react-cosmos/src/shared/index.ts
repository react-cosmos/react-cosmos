export type RendererConfig = {
  containerQuerySelector?: string;
};

declare var RENDERER_CONFIG: RendererConfig;

// NOTE: Renderer config is injected at compile-time
export const rendererConfig: RendererConfig = RENDERER_CONFIG;
