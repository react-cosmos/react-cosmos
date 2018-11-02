/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { Playground } from './Playground';
import './load-plugins';

import type { PlaygroundOptions } from './index.js.flow';

export default function mount(options: PlaygroundOptions) {
  render(<Playground options={options} />, getDomContainer());
}
