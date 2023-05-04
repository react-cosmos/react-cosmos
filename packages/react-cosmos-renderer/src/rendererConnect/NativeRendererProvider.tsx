import React from 'react';
import { RendererContext } from './RendererContext.js';
import { createWebSocketsConnect } from './createWebSocketsConnect.js';

type Props = {
  children: React.ReactNode;
  socketUrl: string;
};
export function NativeRendererProvider({ children, socketUrl }: Props) {
  const value = React.useMemo(() => {
    return {
      // TODO: Generate unique ID per device
      rendererId: 'native-renderer',
      rendererConnect: createWebSocketsConnect(socketUrl),
    };
  }, [socketUrl]);

  return (
    <RendererContext.Provider value={value}>
      {children}
    </RendererContext.Provider>
  );
}
