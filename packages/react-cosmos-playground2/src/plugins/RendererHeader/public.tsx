import * as React from 'react';
import { Slot } from 'react-plugin';
import { ExcludeChildren, PlugProps } from '../../shared/slot';

export type RendererHeaderSpec = {
  name: 'rendererHeader';
};

// TODO: Add support for array slots in react-plugin (eg.
// <Slot name="fixtureActions[]" />)
export function createFixtureAction<Props>(
  BtnComponent: React.ComponentType<ExcludeChildren<Props>>
): React.ComponentType<PlugProps<Props>> {
  return ({ children, ...otherProps }: PlugProps<Props>) => (
    <>
      {children}
      <BtnComponent {...otherProps} />
      <Slot name="fixtureActions" />
    </>
  );
}
