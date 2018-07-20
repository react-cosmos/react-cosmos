// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { createNavHeaderButtonPlug } from './NavHeader';

export default (
  <Plugin name="Responsive Preview">
    <Plug slot="preview" render={ResponsivePreview} />
    {createNavHeaderButtonPlug('Toggle responsive preview')}
  </Plugin>
);

function ResponsivePreview({ children }: any) {
  return (
    <div>
      <div>Responsive controls</div>
      <Slot name="preview">{children}</Slot>
    </div>
  );
}
