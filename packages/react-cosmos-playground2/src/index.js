// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import * as ReactPlugin from 'react-plugin';
import './register-plugins';

import type { PlaygroundConfig } from './index.js.flow';

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
global.ReactPlugin = ReactPlugin;

// TODO: Read list of disabled plugins from user config
const DISABLED_PLUGINS = ['controlPanel'];

export default function mount(config: PlaygroundConfig) {
  const { enablePlugin, loadPlugins, Slot } = ReactPlugin;

  DISABLED_PLUGINS.forEach(pluginName => {
    enablePlugin(pluginName, false);
  });
  loadPlugins({ config });

  render(<Slot name="root" />, getDomContainer());
}
