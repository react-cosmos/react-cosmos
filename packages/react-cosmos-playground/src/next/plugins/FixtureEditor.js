// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { createNavHeaderButtonPlug } from './NavHeader';

export default (
  <Plugin name="Fixture Editor">
    <Plug slot="preview" render={FixtureEditor} />
    {createNavHeaderButtonPlug('Toggle editor')}
  </Plugin>
);

function FixtureEditor({ children }: any) {
  return (
    <div>
      <div>Fixture editor</div>
      <Slot name="preview">{children}</Slot>
    </div>
  );
}
