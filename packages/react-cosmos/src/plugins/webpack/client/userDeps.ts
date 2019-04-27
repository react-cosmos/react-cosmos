import {
  ReactFixturesByPath,
  ReactDecoratorsByPath
} from 'react-cosmos-shared2/react';
import { DomRendererConfig } from '../../../domRenderer';

// NOTE: Renderer data is statically injected at compile time
export const rendererConfig: DomRendererConfig = {
  containerQuerySelector: null
};
export const fixtures: ReactFixturesByPath = {};
export const decorators: ReactDecoratorsByPath = {};
