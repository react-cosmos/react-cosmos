import React from 'react';
import { FixtureId, RendererConfig } from 'react-cosmos-core';
import { createWebSocketsConnect } from 'react-cosmos-renderer';
import {
  RendererContext,
  RendererContextValue,
} from 'react-cosmos-renderer/client';
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
  const value = React.useMemo<RendererContextValue>(() => {
    const socketUrl = getSocketUrl(rendererConfig.playgroundUrl);
    return {
      rendererConfig,
      // TODO: Generate unique ID per device
      rendererId: 'native-renderer',
      rendererConnect: createWebSocketsConnect(socketUrl),
      searchParams: {
        fixtureId: initialFixtureId,
      },
      setSearchParams: () => {},
      reloadRenderer: () => {
        // TODO: Test this manually
        DevSettings.reload();
      },
    };
  }, [initialFixtureId, rendererConfig]);

  return (
    <RendererContext.Provider value={value}>
      {children}
    </RendererContext.Provider>
  );
}
