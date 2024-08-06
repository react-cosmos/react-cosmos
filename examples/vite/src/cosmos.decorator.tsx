import React, { ReactNode } from 'react';
import { Viewport } from 'react-cosmos/client';

type FixtureOptions = {
  viewport?: { width: number; height: number };
};

// TODO: Move this to packages/react-cosmos-core/src/userModules/userModuleTypes.ts
type DecoratorProps<TOptions = {}> = {
  children: ReactNode;
  options: TOptions;
};

export default ({ children, options }: DecoratorProps<FixtureOptions>) => {
  if (options.viewport) {
    return <Viewport {...options.viewport}>{children}</Viewport>;
  }

  return children;
};
