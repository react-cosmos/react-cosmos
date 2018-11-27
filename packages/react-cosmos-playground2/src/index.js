/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-dom';
import { getDomContainer } from 'react-cosmos-shared2/dom';
import { Playground } from './Playground';
import './load-plugins';

import type { PlaygroundConfig } from './index.js.flow';

export default function mount(config: PlaygroundConfig) {
  render(<Playground config={config} />, getDomContainer());
}
