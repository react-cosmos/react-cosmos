/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-dom';
import { Root } from './Root';
import './register-plugins';

import type { PlaygroundOptions } from './index.js.flow';

export default function mount(options: PlaygroundOptions) {
  render(<Root options={options} />, getDomContainer());
}

let container;

function getDomContainer() {
  if (!container) {
    container = document.createElement('div');

    if (!document.body) {
      throw new Error(`document.body missing, can't mount Playground`);
    }

    document.body.appendChild(container);
  }

  return container;
}
