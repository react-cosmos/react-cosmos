import React from 'react';
import { CosmosDecoratorProps, Viewport } from 'react-cosmos/client';

type FixtureOptions = {
  viewport?: { width: number; height: number };
};

export default ({
  children,
  options = {},
}: CosmosDecoratorProps<FixtureOptions>) => {
  if (options.viewport) {
    return <Viewport {...options.viewport}>{children}</Viewport>;
  }

  return children;
};
