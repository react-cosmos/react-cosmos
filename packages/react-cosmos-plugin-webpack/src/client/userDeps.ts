import { ReactDecorators, ReactFixtureWrappers } from 'react-cosmos-core';
import { DomRendererConfig } from 'react-cosmos-dom';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: DomRendererConfig = {
  playgroundUrl: 'http://localhost:5000',
  containerQuerySelector: null,
};
export const fixtures: ReactFixtureWrappers = {};
export const decorators: ReactDecorators = {};
