import React from 'react';
import { FixtureId, RendererConfig } from 'react-cosmos-core';
import {
  createNoopRendererConnect,
  createWebSocketsConnect,
} from 'react-cosmos-renderer';
import { StatefulRendererProvider } from 'react-cosmos-renderer/client';
import { DevSettings } from 'react-native';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  initialFixtureId?: FixtureId | null;
};
export function NativeRendererProvider({
  children,
  rendererConfig: { serverAddress },
  initialFixtureId = null,
}: Props) {
  const rendererConnect = React.useMemo(
    () =>
      serverAddress
        ? createWebSocketsConnect(serverAddress)
        : createNoopRendererConnect(),
    [serverAddress]
  );

  return (
    <StatefulRendererProvider
      // TODO: Generate unique ID per device
      rendererId="native-renderer"
      rendererConnect={rendererConnect}
      locked={false}
      selectedFixtureId={initialFixtureId}
      reloadRenderer={reloadRenderer}
    >
      {children}
    </StatefulRendererProvider>
  );
}

function reloadRenderer() {
  DevSettings.reload();
}
