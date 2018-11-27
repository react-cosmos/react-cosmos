// @flow

import React from 'react';
import { PluginContext } from '../../plugin';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererRemote } from './RendererRemote';

registerGlobalPlugin('renderer-remote', () => (
  <PluginContext.Consumer>
    {({ getConfig }) =>
      getConfig('renderer.enableRemote') && <RendererRemote />
    }
  </PluginContext.Consumer>
));
