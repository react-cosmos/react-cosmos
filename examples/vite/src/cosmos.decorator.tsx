import React from 'react';
import { DecoratorProps, Viewport } from 'react-cosmos/client';

type FixtureOptions = {
  viewport?: { width: number; height: number };
};

export default ({ children, options }: DecoratorProps<FixtureOptions>) => {
  if (options.viewport) {
    return <Viewport {...options.viewport}>{children}</Viewport>;
  }

  return children;
};
