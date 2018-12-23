// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import * as ReactPlugin from 'react-plugin';
import { GlobalStyle } from './globalStyle';

// Statefulness alert!
import './register-plugins';

import type { PlaygroundConfig } from './index.js.flow';

// Enable external plugins to use a shared copy of react-plugin. Also enable
// fiddling with plugins from browser console :D.
global.ReactPlugin = ReactPlugin;

export default function mount(config: PlaygroundConfig) {
  const { loadPlugins, Slot } = ReactPlugin;

  loadPlugins({ config });
  render(
    <>
      <GlobalStyle />
      <Slot name="root" />
    </>,
    getDomContainer()
  );
}
