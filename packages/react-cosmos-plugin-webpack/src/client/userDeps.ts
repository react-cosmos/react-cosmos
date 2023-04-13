import {
  ByPath,
  LazyReactDecoratorWrapper,
  LazyReactFixtureWrapper,
  RendererConfig,
} from 'react-cosmos-core';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: RendererConfig = {
  playgroundUrl: 'http://localhost:5000',
};
export const fixtures: ByPath<LazyReactFixtureWrapper> = {};
export const decorators: ByPath<LazyReactDecoratorWrapper> = {};
