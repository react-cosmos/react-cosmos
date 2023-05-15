import React from 'react';
import { FixtureId, RendererConfig } from 'react-cosmos-core';
import { createWebSocketsConnect } from 'react-cosmos-renderer';
import { ClientRendererProvider } from 'react-cosmos-renderer/client';
import { DevSettings } from 'react-native';
import { getSocketUrl } from './getSocketUrl.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  initialFixtureId?: FixtureId | null;
};
export function NativeRendererProvider({
  children,
  rendererConfig,
  initialFixtureId = null,
}: Props) {
  const rendererConnect = React.useMemo(
    () => createWebSocketsConnect(getSocketUrl(rendererConfig.playgroundUrl)),
    [rendererConfig.playgroundUrl]
  );

  return (
    <ClientRendererProvider
      // TODO: Generate unique ID per device
      rendererId="native-renderer"
      rendererConnect={rendererConnect}
      selectedFixtureId={initialFixtureId}
      locked={false}
      reloadRenderer={reloadRenderer}
    >
      {children}
    </ClientRendererProvider>
  );
}

function reloadRenderer() {
  DevSettings.reload();
}
