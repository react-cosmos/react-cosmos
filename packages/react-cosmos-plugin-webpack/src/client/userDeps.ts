import { ReactDecorators, ReactFixtureWrappers } from 'react-cosmos-core/react';
import { DomRendererConfig } from 'react-cosmos-core/renderer';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: DomRendererConfig = {
  containerQuerySelector: null,
};
export const fixtures: ReactFixtureWrappers = {};
export const decorators: ReactDecorators = {};
