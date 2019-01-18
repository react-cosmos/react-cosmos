// @flow

import React from 'react';
import { Slot } from 'react-plugin';

import type { ComponentType, Node } from 'react';

// Rendering children preserves other plugins that already plugged into the
// "fixtureActions" slot.
// Rendering <Slot name="fixtureActions"> allows more plugins to further plug
// into the "fixtureActions" slot.
export function createFixtureAction<T>(
  BtnComponent: ComponentType<T>
): ComponentType<T & { children: Node }> {
  return ({ children, ...otherProps }: { ...T, children: Node }) => (
    <>
      {children}
      <BtnComponent {...otherProps} />
      <Slot name="fixtureActions" />
    </>
  );
}
