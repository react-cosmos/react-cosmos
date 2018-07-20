// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';

export default (
  <Plugin name="Preview">
    <Plug slot="preview" render={Preview} />
  </Plugin>
);

function Preview() {
  return (
    <Slot name="preview">
      <iframe src="_loader.html" />
    </Slot>
  );
}
