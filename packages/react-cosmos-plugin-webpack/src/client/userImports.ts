import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: RendererConfig = {
  webSocketUrl: 'ws://localhost:5000',
  rendererUrl: null,
};

export const moduleWrappers: UserModuleWrappers = {
  lazy: false,
  fixtures: {},
  decorators: {},
};
