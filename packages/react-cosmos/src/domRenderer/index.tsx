import * as React from 'react';
import { render } from 'react-dom';
import {
  FixtureLoader,
  FixturesByPath,
  DecoratorsByPath,
  createPostMessageConnect,
  createWebSocketsConnect
} from 'react-cosmos-fixture';
import { isInsideCosmosPreviewIframe } from './shared';
import { getDomContainer } from './container';
import { ErrorCatch } from './ErrorCatch';
import { getRendererId } from './rendererId';
import { addGlobalErrorHandler } from './globalErrorHandler';

export type DomRendererConfig = {
  containerQuerySelector: null | string;
};

type MountDomRendererOpts = {
  rendererConfig: DomRendererConfig;
  fixtures: FixturesByPath;
  decorators: DecoratorsByPath;
  onFixtureChange?: () => unknown;
};

const rendererId = getRendererId();

export function mountDomRenderer({
  fixtures,
  decorators,
  rendererConfig,
  onFixtureChange
}: MountDomRendererOpts) {
  addGlobalErrorHandler(rendererId);
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
