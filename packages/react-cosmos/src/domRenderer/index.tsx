import React from 'react';
import { FixtureLoader } from 'react-cosmos-fixture';
import {
  ReactDecoratorsByPath,
  ReactFixturesByPath
} from 'react-cosmos-shared2/react';
import { render } from 'react-dom';
import { DomRendererConfig } from '../shared/rendererConfig';
import { getDomContainer } from './container';
import { ErrorCatch } from './ErrorCatch';
import './globalErrorHandler';
import { rendererConnect } from './rendererConnect';
import { rendererId } from './rendererId';
import { renderMessage } from './renderMessage';

type MountDomRendererOpts = {
  rendererConfig: DomRendererConfig;
  fixtures: ReactFixturesByPath;
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
  render(
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      fixtures={fixtures}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      renderMessage={renderMessage}
      onErrorReset={onErrorReset}
    />,
    getDomContainer(rendererConfig.containerQuerySelector)
  );
}
