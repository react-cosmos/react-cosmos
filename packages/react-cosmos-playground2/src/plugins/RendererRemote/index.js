// @flow

import React from 'react';
import { registerDefaultPluginConfig, PluginContext } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererRemote } from './RendererRemote';

registerDefaultPluginConfig('enableRemoteRenderers', false);

registerGlobalPlugin('RendererRemote', () => (
  <PluginContext.Consumer>
    {({ getConfig }) =>
      getConfig('enableRemoteRenderers') ? <RendererRemote /> : null
    }
  </PluginContext.Consumer>
));
