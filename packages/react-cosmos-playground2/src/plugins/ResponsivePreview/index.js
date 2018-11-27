// @flow

import React from 'react';
import {
  registerDefaultPluginConfig,
  registerInitialPluginState,
  PluginContext
} from '../../plugin';
import { register, Plugin, Plug } from 'react-plugin';
import { ResponsivePreview } from './ResponsivePreview';

import type { ResponsivePreviewConfig, ResponsivePreviewState } from './shared';
export type { ResponsivePreviewConfig, ResponsivePreviewState } from './shared';

const PLUGIN_NAME = 'responsive-preview';

const defaultConfig: ResponsivePreviewConfig = {
  devices: [
    { label: 'iPhone 5', width: 320, height: 568 },
    { label: 'iPhone 6', width: 375, height: 667 },
    { label: 'iPhone 6 Plus', width: 414, height: 736 },
    { label: 'Medium', width: 1024, height: 768 },
    { label: 'Large', width: 1440, height: 900 },
    { label: '1080p', width: 1920, height: 1080 }
  ]
};

const initialState: ResponsivePreviewState = {
  enabled: false,
  viewport: null
};

registerDefaultPluginConfig(PLUGIN_NAME, defaultConfig);
registerInitialPluginState(PLUGIN_NAME, initialState);

register(
  <Plugin name={PLUGIN_NAME}>
    <Plug
      slot="rendererPreviewOuter"
      render={({ children }) => (
        <PluginContext.Consumer>
          {({ getConfig }) =>
            getConfig('renderer.webUrl') && (
              <ResponsivePreview>{children}</ResponsivePreview>
            )
          }
        </PluginContext.Consumer>
      )}
    />
  </Plugin>
);
