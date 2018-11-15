// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';
import { RendererIframePreview } from './RendererIframePreview';

register(
  <Plugin name="RendererIframePreview">
    <Plug
      slot="rendererPreview"
      render={() => (
        <PlaygroundContext.Consumer>
          {({ options: { rendererPreviewUrl } }) =>
            rendererPreviewUrl ? (
              <RendererIframePreview rendererPreviewUrl={rendererPreviewUrl} />
            ) : null
          }
        </PlaygroundContext.Consumer>
      )}
    />
  </Plugin>
);
