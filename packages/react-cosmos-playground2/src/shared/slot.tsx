import * as React from 'react';
import { Slot } from 'react-plugin';

type Children = { children?: React.ReactNode };

type ExcludeChildren<Props> = Pick<Props, Exclude<keyof Props, 'children'>>;

type PlugProps<ComponentProps> = ComponentProps & Children;

export function createArrayPlug<Props>(
  slotName: string,
  Component: React.ComponentType<ExcludeChildren<Props>>
): React.ComponentType<PlugProps<Props>> {
  return ({ children, ...otherProps }: PlugProps<Props>) => (
    <>
      {children}
      <Component {...otherProps} />
      <Slot name={slotName} />
    </>
  );
}
