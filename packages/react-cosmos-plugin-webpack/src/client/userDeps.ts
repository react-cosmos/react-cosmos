import {
  ReactDecorators,
  ReactFixtureWrappers,
  RendererConfig,
} from 'react-cosmos-core';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: RendererConfig = {
  playgroundUrl: 'http://localhost:5000',
};
export const fixtures: ReactFixtureWrappers = {};
export const decorators: ReactDecorators = {};
