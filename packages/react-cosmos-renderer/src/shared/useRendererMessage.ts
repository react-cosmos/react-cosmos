import React from 'react';
import { RendererRequest } from 'react-cosmos-core';
import { RendererContext } from './RendererContext.js';

export function useRendererMessage(cb: (msg: RendererRequest) => void) {
  const { rendererId, rendererConnect } = React.useContext(RendererContext);

  React.useEffect(() => {
    const unsubscribe = rendererConnect.onMessage((msg: RendererRequest) => {
      if (
        msg.type === 'pingRenderers' ||
        (msg.payload && msg.payload.rendererId === rendererId)
      ) {
        cb(msg);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [cb, rendererConnect, rendererId]);
}
