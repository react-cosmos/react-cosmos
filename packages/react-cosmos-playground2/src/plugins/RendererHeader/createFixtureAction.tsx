import * as React from 'react';
import { Slot } from 'react-plugin';

type Children = { children: React.ReactNode };
type ExcludeChildren<Props extends Children> = Pick<
  Props,
  Exclude<keyof Props, 'children'>
>;

// Rendering children preserves other plugins that already plugged into the
// "fixtureActions" slot.
// Rendering <Slot name="fixtureActions"> allows more plugins to further plug
// into the "fixtureActions" slot.
export function createFixtureAction<Props extends Children>(
  BtnComponent: React.ComponentType<ExcludeChildren<Props>>
): React.ComponentType<Props> {
  return ({ children, ...otherProps }: Props) => (
    <>
      {children}
      <BtnComponent {...otherProps} />
      <Slot name="fixtureActions" />
    </>
  );
}
