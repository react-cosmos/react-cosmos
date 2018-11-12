// @flow

import React from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { RendererResponseHandler } from './RendererResponseHandler';

export type { RendererState } from './shared';

register(
  <Plugin name="RendererResponseHandler">
    <Plug slot="root" render={RendererResponseHandler} />
  </Plugin>
);
