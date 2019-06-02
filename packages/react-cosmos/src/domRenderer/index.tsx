import * as React from 'react';
import { render } from 'react-dom';
import { FixtureLoader } from 'react-cosmos-fixture';
import {
  ReactDecoratorsByPath,
  ReactFixturesByPath
} from 'react-cosmos-shared2/react';
import { rendererId } from './rendererId';
import { rendererConnect } from './rendererConnect';
import { getDomContainer } from './container';
import { ErrorCatch } from './ErrorCatch';
import './globalErrorHandler';

export type DomRendererConfig = {
  containerQuerySelector: null | string;
};

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
      onErrorReset={onErrorReset}
    />,
    getDomContainer(rendererConfig.containerQuerySelector)
  );
}
