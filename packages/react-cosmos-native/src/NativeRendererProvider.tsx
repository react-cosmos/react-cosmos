import React from 'react';
import { RendererConfig } from 'react-cosmos-core';
import {
  RendererContext,
  RendererContextValue,
  createWebSocketsConnect,
} from 'react-cosmos-renderer/client';
import { DevSettings } from 'react-native';
import { getSocketUrl } from './getSocketUrl.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
};
export function NativeRendererProvider({ children, rendererConfig }: Props) {
  const value = React.useMemo<RendererContextValue>(() => {
    const socketUrl = getSocketUrl(rendererConfig.playgroundUrl);
    return {
      rendererConfig,
      // TODO: Generate unique ID per device
      rendererId: 'native-renderer',
      rendererConnect: createWebSocketsConnect(socketUrl),
      searchParams: {},
      setSearchParams: () => {},
      reloadRenderer: () => {
        // TODO: Test this manually
        DevSettings.reload();
      },
    };
  }, [rendererConfig]);

  return (
    <RendererContext.Provider value={value}>
      {children}
    </RendererContext.Provider>
  );
}
