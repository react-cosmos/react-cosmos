// @flow

import React from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { Router } from './Router';

export type { RouterState } from './shared';

// Rendering <Slot name="root"> allows other plugins to further plug into
// the "root" plugin slot.
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
