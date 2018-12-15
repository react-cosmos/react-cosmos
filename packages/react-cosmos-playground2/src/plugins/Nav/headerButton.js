// @flow

import React from 'react';
import { Slot } from 'react-plugin';

import type { ComponentType, Node } from 'react';

// Rendering "children" preserves other plugins that already plugged into the
// "header-buttons" slot.
// Rendering <Slot name="header-buttons"> allows more plugins to further plug
// into the "header-buttons" slot.
export function createHeaderButton<T>(
  BtnComponent: ComponentType<T>
): ComponentType<{ ...T, children: Node }> {
  return ({ children, ...otherProps }: { ...T, children: Node }) => (
    <>
      {children}
      <BtnComponent {...otherProps} />
      <Slot name="header-buttons" />
    </>
  );
}
