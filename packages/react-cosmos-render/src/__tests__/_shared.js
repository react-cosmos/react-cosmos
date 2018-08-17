// @flow

import React from 'react';
import { create as fakeRender } from 'react-test-renderer';
import { Render } from '../Render';

import type { Node } from 'react';

export function render(node: Node) {
  return fakeRender(<Render>{node}</Render>).toJSON();
}
