import React from 'react';
import { DecoratorProps, Viewport } from 'react-cosmos/client';

type FixtureOptions = {
  viewport?: { width: number; height: number };
};

function ViewportDecorator({
  children,
  options,
}: DecoratorProps<FixtureOptions>) {
  if (options.viewport)
    return <Viewport {...options.viewport}>{children}</Viewport>;

  return children;
}

export default [ViewportDecorator];
