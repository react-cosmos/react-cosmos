// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { enablePlugin } from 'ui-plugin';
import { loadPlugins, Slot } from 'react-plugin';
import './register-plugins';

import type { PlaygroundConfig } from './index.js.flow';

// TODO: Read list of disabled plugins from user config
const DISABLED_PLUGINS = ['controlPanel'];

export default function mount(config: PlaygroundConfig) {
  DISABLED_PLUGINS.forEach(pluginName => {
    enablePlugin(pluginName, false);
  });
  loadPlugins({ config });
  render(<Slot name="root" />, getDomContainer());
}
