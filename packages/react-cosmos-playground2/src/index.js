/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-dom';
import { Slot } from 'react-plugin';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { Root } from './Root';
import './load-plugins';

import type { PlaygroundOptions } from './index.js.flow';

export default function mount(options: PlaygroundOptions) {
  render(
    <Root options={options}>
      <Slot name="preview" />
    </Root>,
    getDomContainer()
  );
}
