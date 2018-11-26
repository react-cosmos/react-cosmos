// @flow

import React from 'react';
import { PluginContext } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererRemote } from './RendererRemote';

registerGlobalPlugin('RendererRemote', () => (
  <PluginContext.Consumer>
    {({ getConfig }) =>
      getConfig('renderer.enableRemoteConnect') ? <RendererRemote /> : null
    }
  </PluginContext.Consumer>
));
