// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';

// Use to test if a plugin decorates an existing plugin instead of overriding it
export function registerTestPlugin(slotName: string) {
  register(
    <Plugin name="Test">
      <Plug
        slot={slotName}
        render={({ children }) => (
          <div data-testid="test-plugin">{children}</div>
        )}
      />
    </Plugin>
  );
}
