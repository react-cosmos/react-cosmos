// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { registerDefaultPluginConfig, PluginContext } from '../../plugin';
import { RendererIframePreview } from './RendererIframePreview';

registerDefaultPluginConfig('rendererPreviewUrl', null);

register(
  <Plugin name="RendererIframePreview">
    <Plug
      slot="rendererPreview"
      render={() => (
        <PluginContext.Consumer>
          {({ getConfig }) => {
            const rendererPreviewUrl = getConfig('rendererPreviewUrl');

            return rendererPreviewUrl ? (
              <RendererIframePreview rendererPreviewUrl={rendererPreviewUrl} />
            ) : null;
          }}
        </PluginContext.Consumer>
      )}
    />
  </Plugin>
);
