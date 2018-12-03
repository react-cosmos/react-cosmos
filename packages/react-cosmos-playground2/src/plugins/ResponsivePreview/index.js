// @flow

import React from 'react';
import {
  registerDefaultPluginConfig,
  registerInitialPluginState
} from '../../plugin';
import { register, Plugin, Plug } from 'react-plugin';
import { createHeaderButtonSlot } from '../Nav/headerButton';
import { ResponsivePreview } from './ResponsivePreview';
import { ToggleButton } from './ToggleButton';
import { DEFAULT_DEVICES } from './shared';

import type { ResponsivePreviewConfig, ResponsivePreviewState } from './shared';
export type { ResponsivePreviewConfig, ResponsivePreviewState } from './shared';

const PLUGIN_NAME = 'responsive-preview';

const defaultConfig: ResponsivePreviewConfig = {
  devices: DEFAULT_DEVICES
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
        <ResponsivePreview>{children}</ResponsivePreview>
      )}
    />
    {createHeaderButtonSlot(ToggleButton)}
  </Plugin>
);
