import React from 'react';
import { render } from 'react-dom';
import {
  ReactDecorators,
  ReactFixtureWrappers,
} from '../../core/react/types.js';
import { DomRendererConfig } from '../rendererConfig.js';
import { DomFixtureLoader } from './DomFixtureLoader.js';
import { getDomContainer } from './getDomContainer.js';
import './globalErrorHandler.js';

type Args = {
  rendererConfig: DomRendererConfig;
  fixtures: ReactFixtureWrappers;
  decorators: ReactDecorators;
  onErrorReset?: () => unknown;
};
export function mountDomRenderer({
  rendererConfig,
  fixtures,
  decorators,
  onErrorReset,
}: Args) {
  const domContainer = getDomContainer(rendererConfig.containerQuerySelector);
  render(
    <DomFixtureLoader
      fixtures={fixtures}
      decorators={decorators}
      onErrorReset={onErrorReset}
    />,
    domContainer
  );
}
