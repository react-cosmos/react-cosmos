import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: RendererConfig = {
  playgroundUrl: 'http://localhost:5000',
  reloadOnFixtureChange: false,
};

export const moduleWrappers: UserModuleWrappers = {
  lazy: false,
  fixtures: {},
  decorators: {},
};
