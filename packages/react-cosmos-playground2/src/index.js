/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-dom';
import { Root } from './Root';
import './register-plugins';

export default () => {
  render(<Root />, getDomContainer());
};

let container;

function getDomContainer() {
  if (!container) {
    container = document.createElement('div');

    if (!document.body) {
      throw new Error(`document.body missing while mounting Playground`);
    }

    document.body.appendChild(container);
  }

  return container;
}
