// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { Nav } from './Nav';

register(
  <Plugin name="nav">
    <Plug slot="left" render={Nav} />
  </Plugin>
);
