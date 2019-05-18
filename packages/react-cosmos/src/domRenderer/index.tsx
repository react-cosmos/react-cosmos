import * as React from 'react';
import { render } from 'react-dom';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  ReactFixturesByPath,
  ReactDecoratorsByPath
} from 'react-cosmos-shared2/react';
import {
  FixtureLoader,
  createPostMessageConnect,
  createWebSocketsConnect
} from 'react-cosmos-fixture';
import { isInsideCosmosPreviewIframe } from './shared';
import { getDomContainer } from './container';
import { ErrorCatch } from './ErrorCatch';

export type DomRendererConfig = {
  containerQuerySelector: null | string;
};

type MountDomRendererOpts = {
  rendererId: RendererId;
  rendererConfig: DomRendererConfig;
  fixtures: ReactFixturesByPath;
  decorators: ReactDecoratorsByPath;
  onFixtureChange?: () => unknown;
};

export { getRendererId } from './rendererId';
export { addGlobalErrorHandler } from './globalErrorHandler';

export function mountDomRenderer({
  rendererId,
  fixtures,
  decorators,
  rendererConfig,
  onFixtureChange
}: MountDomRendererOpts) {
  render(
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={getRendererConnect()}
      fixtures={fixtures}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      onFixtureChange={onFixtureChange}
    />,
    getDomContainer(rendererConfig.containerQuerySelector)
  );
}

function getRendererConnect() {
  return isInsideCosmosPreviewIframe()
    ? createPostMessageConnect()
    : createWebSocketsConnect(getWebSocketsUrl());
}

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
