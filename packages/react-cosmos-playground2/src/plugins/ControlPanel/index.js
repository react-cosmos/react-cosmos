// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { Preview } from './Preview';

register(
  <Plugin name="ControlPanel">
    <Plug slot="preview" render={Preview} />
  </Plugin>
);
