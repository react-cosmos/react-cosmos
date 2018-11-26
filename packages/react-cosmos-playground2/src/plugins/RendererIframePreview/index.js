// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { PluginContext } from '../../plugin';
import { RendererIframePreview } from './RendererIframePreview';

register(
  <Plugin name="RendererIframePreview">
    <Plug
      slot="rendererPreview"
      render={() => (
        <PluginContext.Consumer>
          {({ getConfig }) => {
            const rendererUrl = getConfig('renderer.webUrl');

            return rendererUrl ? (
              <RendererIframePreview rendererUrl={rendererUrl} />
            ) : null;
          }}
        </PluginContext.Consumer>
      )}
    />
  </Plugin>
);
