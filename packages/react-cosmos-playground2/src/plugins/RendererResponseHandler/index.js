// @flow

import React from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { RendererResponseHandler } from './RendererResponseHandler';

export type { RendererState } from './shared';

// Rendering <Slot name="root"> allows other plugins to further plug into
// the "root" plugin slot.
// TODO(vision): This plugin doesn't need a UI component, it only manages state
// and methods.
register(
  <Plugin name="RendererResponseHandler">
    <Plug
      slot="root"
      render={({ children }) => (
        <RendererResponseHandler>
          <Slot name="root">{children}</Slot>
        </RendererResponseHandler>
      )}
    />
  </Plugin>
);
