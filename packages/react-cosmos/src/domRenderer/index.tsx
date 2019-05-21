import * as React from 'react';
import { render } from 'react-dom';
import { FixtureLoader } from 'react-cosmos-fixture';
import {
  ReactDecoratorsByPath,
  ReactFixturesByPath
} from 'react-cosmos-shared2/react';
import { getRendererId } from './rendererId';
import { getRendererConnect } from './rendererConnect';
import { getDomContainer } from './container';
import { addGlobalErrorHandler } from './globalErrorHandler';
import { ErrorCatch } from './ErrorCatch';

export type DomRendererConfig = {
  containerQuerySelector: null | string;
};

type MountDomRendererOpts = {
  rendererConfig: DomRendererConfig;
  fixtures: ReactFixturesByPath;
  decorators: ReactDecoratorsByPath;
  onFixtureChange?: () => unknown;
};

export { getRendererId } from './rendererId';
export { getRendererConnect } from './rendererConnect';

export function mountDomRenderer({
  rendererConfig,
  fixtures,
  decorators,
  onFixtureChange
}: MountDomRendererOpts) {
  const rendererId = getRendererId();
  const rendererConnect = getRendererConnect();
  addGlobalErrorHandler(rendererId, rendererConnect);
  render(
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      fixtures={fixtures}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      onFixtureChange={onFixtureChange}
    />,
    getDomContainer(rendererConfig.containerQuerySelector)
  );
}
