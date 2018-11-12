// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { Root } from './Root';

register(
  <Plugin name="Preview">
    <Plug slot="root" render={Root} />
  </Plugin>
);
