import React from 'react';
import { FixtureId, RendererConfig } from 'react-cosmos-core';
import { createWebSocketsConnect } from 'react-cosmos-renderer';
import { RendererProvider } from 'react-cosmos-renderer/client';
import { DevSettings } from 'react-native';
import { getSocketUrl } from './getSocketUrl.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  initialFixtureId?: FixtureId;
};
export function NativeRendererProvider({
  children,
  rendererConfig,
  initialFixtureId,
}: Props) {
  const rendererConnect = React.useMemo(
    () => createWebSocketsConnect(getSocketUrl(rendererConfig.playgroundUrl)),
    [rendererConfig.playgroundUrl]
  );

  const searchParams = React.useMemo(
    () => ({ fixtureId: initialFixtureId }),
    [initialFixtureId]
  );

  return (
    <RendererProvider
      // TODO: Generate unique ID per device
      rendererId="native-renderer"
      rendererConnect={rendererConnect}
      searchParams={searchParams}
      setSearchParams={noop}
      reloadRenderer={reloadRenderer}
    >
      {children}
    </RendererProvider>
  );
}

function reloadRenderer() {
  DevSettings.reload();
}

function noop() {}
