import {
  DomRendererConfig,
  ReactDecorators,
  ReactFixtureWrappers,
} from 'react-cosmos-core';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: DomRendererConfig = {
  containerQuerySelector: null,
};
export const fixtures: ReactFixtureWrappers = {};
export const decorators: ReactDecorators = {};
