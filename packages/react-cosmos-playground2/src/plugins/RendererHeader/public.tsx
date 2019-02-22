import * as React from 'react';
import { Slot } from 'react-plugin';

export type RendererHeaderSpec = {
  name: 'rendererHeader';
};

type Children = { children?: React.ReactNode };

type ExcludeChildren<Props> = Pick<Props, Exclude<keyof Props, 'children'>>;

type PlugProps<ComponentProps> = ComponentProps & Children;

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
