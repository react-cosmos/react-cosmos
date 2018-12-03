// @flow

import React from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { PluginContext } from '../../plugin';
import { RendererPreview } from './RendererPreview';

import type { RendererConfig } from '../Renderer';

register(
  <Plugin name="renderer-preview">
    <Plug
      slot="rendererPreview"
      render={() => (
        <PluginContext.Consumer>
          {({ getConfig }) => {
            const { webUrl }: RendererConfig = getConfig('renderer');

            return (
              webUrl && (
                <Slot name="rendererPreviewOuter">
                  <RendererPreview rendererUrl={webUrl} />
                </Slot>
              )
            );
          }}
        </PluginContext.Consumer>
      )}
    />
  </Plugin>
);
