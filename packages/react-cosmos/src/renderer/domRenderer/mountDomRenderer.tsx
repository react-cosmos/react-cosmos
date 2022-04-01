import React from 'react';
import { render } from 'react-dom';
import { ReactDecorators, ReactFixtureWrappers } from '../../core/react/types';
import { DomRendererConfig } from '../rendererConfig';
import { DomFixtureLoader } from './DomFixtureLoader';
import { getDomContainer } from './getDomContainer';
import './globalErrorHandler';

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
