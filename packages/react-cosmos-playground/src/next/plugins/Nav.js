// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';

export default (
  <Plugin name="Nav">
    <Plug slot="root" render={Nav} />
  </Plugin>
);

function Nav() {
  return (
    <Slot name="root">
      <div>
        <Slot name="nav-header" />
        <div>Nav here</div>
      </div>
      <Slot name="preview" />
    </Slot>
  );
}
