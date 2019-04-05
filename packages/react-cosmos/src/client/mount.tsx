import * as React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  createPostMessageConnect,
  createWebSocketsConnect,
  FixtureLoader
} from 'react-cosmos-fixture';
import { RendererConfig } from '../shared';
import { fixtures, decorators } from './userModules';
import { ErrorCatch } from './ErrorCatch';

type RendererOptions = {
  rendererId: RendererId;
  rendererConfig: RendererConfig;
  onFixtureChange?: () => unknown;
};

export function mount({
  rendererId,
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
