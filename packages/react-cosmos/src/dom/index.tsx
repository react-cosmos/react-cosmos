import React from 'react';
import { FixtureLoader } from 'react-cosmos-shared2/FixtureLoader';
import {
  ReactDecoratorsByPath,
  ReactFixtureExportsByPath
} from 'react-cosmos-shared2/react';
import { render } from 'react-dom';
import { DomRendererConfig } from '../shared/rendererConfig';
import { getDomContainer } from './container';
import { ErrorCatch } from './ErrorCatch';
import './globalErrorHandler';
import { rendererConnect } from './rendererConnect';
import { rendererId } from './rendererId';
import { renderMessage } from './renderMessage';
import { selectedFixtureId } from './selectedFixtureId';

type MountDomRendererOpts = {
  rendererConfig: DomRendererConfig;
  fixtures: ReactFixtureExportsByPath;
  decorators: ReactDecoratorsByPath;
  onErrorReset?: () => unknown;
};

export { rendererId, rendererConnect };

export function mountDomRenderer({
  rendererConfig,
  fixtures,
  decorators,
  onErrorReset
}: MountDomRendererOpts) {
  const domContainer = getDomContainer(rendererConfig.containerQuerySelector);
  render(
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      fixtures={fixtures}
      selectedFixtureId={selectedFixtureId}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      renderMessage={renderMessage}
      onErrorReset={onErrorReset}
    />,
    domContainer
  );
}
