// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundContext } from '../context';

export default (
  <Plugin name="Preview">
    <Plug slot="preview" render={Preview} />
  </Plugin>
);

function Preview() {
  return (
    <Slot name="preview">
      <PlaygroundContext.Consumer>
        {({ options }) => <iframe src={options.rendererUrl} frameBorder={0} />}
      </PlaygroundContext.Consumer>
    </Slot>
  );
}
