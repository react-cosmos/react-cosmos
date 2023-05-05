import React from 'react';
import {
  RendererContext,
  RendererContextValue,
  createWebSocketsConnect,
} from 'react-cosmos-renderer/client';

import { DevSettings } from 'react-native';

type Props = {
  children: React.ReactNode;
  socketUrl: string;
};
export function NativeRendererProvider({ children, socketUrl }: Props) {
  const value = React.useMemo<RendererContextValue>(() => {
    return {
      // TODO: Generate unique ID per device
      rendererId: 'native-renderer',
      rendererConnect: createWebSocketsConnect(socketUrl),
      reloadFixture: () => {
        // TODO: Test this manually
        DevSettings.reload();
      },
    };
  }, [socketUrl]);

  return (
    <RendererContext.Provider value={value}>
      {children}
    </RendererContext.Provider>
  );
}
