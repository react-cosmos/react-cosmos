// @flow

import React from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { RendererIframePreview } from './RendererIframePreview';

// The root <Slot name="preview"> allows other plugins to further decorate
// the "preview" plugin slot.
register(
  <Plugin name="RendererIframePreview">
    <Plug
      slot="preview"
      render={() => (
        <Slot name="preview">
          <RendererIframePreview />
        </Slot>
      )}
    />
  </Plugin>
);
