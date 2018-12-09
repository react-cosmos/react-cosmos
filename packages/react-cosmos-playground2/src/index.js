// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { loadPlugins, Slot } from 'react-plugin';
import './register-plugins';

import type { PlaygroundConfig } from './index.js.flow';

export default function mount(config: PlaygroundConfig) {
  loadPlugins({ config }, () => {
    render(<Slot name="root" />, getDomContainer());
  });
}
