import * as React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { RendererId } from 'react-cosmos-shared2/renderer';
import {
  ConnectRenderCb,
  RemoteRendererApi,
  PostMessage,
  WebSockets,
  FixtureConnect
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
    wrapSuitableAdaptor(
      createFixtureConnectRenderCb(rendererId, onFixtureChange)
    ),
    getDomContainer(rendererConfig.containerQuerySelector)
  );
}

function wrapSuitableAdaptor(connectRenderCb: ConnectRenderCb) {
  if (isInsideIframe()) {
    return <PostMessage>{connectRenderCb}</PostMessage>;
  }

  return <WebSockets url={getWebSocketsUrl()}>{connectRenderCb}</WebSockets>;
}

function createFixtureConnectRenderCb(
  rendererId: RendererId,
  onFixtureChange?: () => unknown
) {
  return ({ subscribe, unsubscribe, postMessage }: RemoteRendererApi) => (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      subscribe={subscribe}
      unsubscribe={unsubscribe}
      postMessage={postMessage}
      onFixtureChange={onFixtureChange}
    />
  );
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
