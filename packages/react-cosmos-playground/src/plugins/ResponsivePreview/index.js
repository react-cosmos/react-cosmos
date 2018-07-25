// @flow

import React from 'react';
import { Plugin, Plug } from 'react-plugin';
import { PreviewSlot } from './Preview';
import { HeaderButtonsSlot } from './HeaderButton';

export default (
  <Plugin name="Responsive Preview">
    <Plug slot="preview" render={PreviewSlot} />
    <Plug slot="header-buttons" render={HeaderButtonsSlot} />
  </Plugin>
);
