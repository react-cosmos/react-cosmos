// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { Section } from '../Section';

export default (
  <Plugin name="Preview">
    <Plug slot="preview" render={Preview} />
  </Plugin>
);

function Preview() {
  return (
    <Slot name="preview">
      <Section label="Preview" />
    </Slot>
  );
}
