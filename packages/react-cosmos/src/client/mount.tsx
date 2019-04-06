import * as React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  FixtureLoader,
  FixturesByPath,
  createPostMessageConnect,
  createWebSocketsConnect
} from 'react-cosmos-fixture';
import { RendererConfig } from '../shared';
import { ErrorCatch } from './ErrorCatch';
import { DecoratorsByPath } from 'react-cosmos-fixture/src';

type RendererOptions = {
  rendererId: RendererId;
  rendererConfig: RendererConfig;
  fixtures: FixturesByPath;
  decorators: DecoratorsByPath;
  onFixtureChange?: () => unknown;
};

export function mount({
  rendererId,
  fixtures,
  decorators,
  rendererConfig,
  onFixtureChange
}: RendererOptions) {
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
  return isInsideIframe()
    ? createPostMessageConnect()
    : createWebSocketsConnect(getWebSocketsUrl());
}

function isInsideIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function getWebSocketsUrl() {
  // TODO: Allow user to input URL
  return location.origin;
}
