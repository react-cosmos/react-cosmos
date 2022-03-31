import { DomRendererConfig } from 'react-cosmos/src/renderer/rendererConfig';
import {
  ReactDecorators,
  ReactFixtureWrappers,
} from 'react-cosmos/src/utils/react/types';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: DomRendererConfig = {
  containerQuerySelector: null,
};
export const fixtures: ReactFixtureWrappers = {};
export const decorators: ReactDecorators = {};
