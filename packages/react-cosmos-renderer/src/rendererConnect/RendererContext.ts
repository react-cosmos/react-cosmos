import React from 'react';
import { RendererConnect } from 'react-cosmos-core';

type RendererContextValue = {
  rendererId: string;
  rendererConnect: RendererConnect;
};

export const RendererContext = React.createContext<RendererContextValue>({
  rendererId: 'default-renderer-id',
  rendererConnect: {
    postMessage: () => {},
    onMessage: () => () => {},
  },
});
