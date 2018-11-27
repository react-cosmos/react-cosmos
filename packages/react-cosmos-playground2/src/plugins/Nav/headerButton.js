// @flow

import React from 'react';
import { Plug, Slot } from 'react-plugin';

import type { ComponentType } from 'react';

// Rendering "children" preserves other plugins that already plugged into the
// "header-buttons" slot.
// Rendering <Slot name="header-buttons"> allows more plugins to further plug
// into the "header-buttons" slot.
export function createHeaderButtonSlot(PluginType: ComponentType<any>) {
  return (
    <Plug
      slot="header-buttons"
      render={({ children }) => (
        <>
          {children}
          <PluginType />
          <Slot name="header-buttons" />
        </>
      )}
    />
  );
}
