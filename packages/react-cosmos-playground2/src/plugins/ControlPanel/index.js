// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { ControlPanel } from './ControlPanel';

register(
  <Plugin name="control-panel">
    <Plug slot="right" render={ControlPanel} />
  </Plugin>
);
