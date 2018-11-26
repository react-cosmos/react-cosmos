// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { PluginContext } from '../../plugin';
import { RendererPreview } from './RendererPreview';

register(
  <Plugin name="renderer-preview">
    <Plug
      slot="rendererPreview"
      render={() => (
        <PluginContext.Consumer>
          {({ getConfig }) => {
            const rendererUrl = getConfig('renderer.webUrl');

            return rendererUrl ? (
              <RendererPreview rendererUrl={rendererUrl} />
            ) : null;
          }}
        </PluginContext.Consumer>
      )}
    />
  </Plugin>
);
