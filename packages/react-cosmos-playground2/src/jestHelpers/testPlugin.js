// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';

// Use to test if a Plug continues to expose the slot it occupies for other
// plugins to act as decorators.
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
