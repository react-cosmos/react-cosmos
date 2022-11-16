import React from 'react';
import {
  DomRendererConfig,
  ReactDecorators,
  ReactFixtureWrappers,
} from 'react-cosmos-core';
import { render } from 'react-dom';
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
