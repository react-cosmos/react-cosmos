// @flow

import React from 'react';
import { PluginContext } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererRemoteConnect } from './RendererRemoteConnect';

registerGlobalPlugin('RendererRemoteConnect', () => (
  <PluginContext.Consumer>
    {({ getConfig }) =>
      getConfig('renderer.enableRemoteConnect') ? (
        <RendererRemoteConnect />
      ) : null
    }
  </PluginContext.Consumer>
));
