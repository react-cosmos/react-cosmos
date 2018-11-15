// @flow

import React from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';
import { registerGlobalPlugin } from '../../Playground/registerGlobalPlugin';
import { RendererRemote } from './RendererRemote';

registerGlobalPlugin('RendererRemote', () => (
  <PlaygroundContext.Consumer>
    {({ options: { enableRemoteRenderers } }) =>
      enableRemoteRenderers ? <RendererRemote /> : null
    }
  </PlaygroundContext.Consumer>
));
