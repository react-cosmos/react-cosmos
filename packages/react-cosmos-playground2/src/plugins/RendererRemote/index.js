// @flow

import React from 'react';
import { PluginContext } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererRemote } from './RendererRemote';

import type { RendererConfig } from '../Renderer';

registerGlobalPlugin('renderer-remote', () => (
  <PluginContext.Consumer>
    {({ getConfig }) => {
      const { enableRemote }: RendererConfig = getConfig('renderer');

      return enableRemote ? <RendererRemote /> : null;
    }}
  </PluginContext.Consumer>
));
