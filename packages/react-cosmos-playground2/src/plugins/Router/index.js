// @flow

import React from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { Router } from './Router';

export type { RouterState } from './shared';

// Rendering <Slot name="root"> allows other plugins to further plug into
// the "root" plugin slot.
// TODO(vision): This plugin doesn't need a UI component, it only manages state
// and methods.
register(
  <Plugin name="Router">
    <Plug
      slot="root"
      render={({ children }) => (
        <Router>
          <Slot name="root">{children}</Slot>
        </Router>
      )}
    />
  </Plugin>
);
