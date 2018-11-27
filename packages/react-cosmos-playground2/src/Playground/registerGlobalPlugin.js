// @flow

import React from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';

import type { ComponentType } from 'react';

// Rendering <Slot name="global"> allows other plugins to further plug into
// the "global" plugin slot.
// TODO(vision): These plugins doesn't have UI so they shouldn't be React
// components. The plugin UI should have an API at a higher level than React.
export function registerGlobalPlugin(
  pluginName: string,
  PluginType: ComponentType<any>
) {
  register(
    <Plugin name={pluginName}>
      <Plug
        slot="global"
        render={({ children }) => (
          <>
            {children}
            <PluginType />
            <Slot name="global" />
          </>
        )}
      />
    </Plugin>
  );
}
