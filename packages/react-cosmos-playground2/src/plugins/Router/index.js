// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { Router } from './Router';

export type { RouterState } from './shared';

register(
  <Plugin name="Router">
    <Plug slot="root" render={Router} />
  </Plugin>
);
