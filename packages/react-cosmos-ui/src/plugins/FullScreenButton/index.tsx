import React from 'react';
import { createWebRendererUrl } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { RendererActionSlotProps } from '../../slots/RendererActionSlot.js';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { FullScreenButton } from './FullScreenButton.js';
import { FullScreenButtonSpec } from './spec.js';

const { namedPlug, register } = createPlugin<FullScreenButtonSpec>({
  name: 'fullScreenButton',
});

namedPlug<RendererActionSlotProps>(
  'rendererAction',
  'fullScreen',
  ({ pluginContext, slotProps }) => {
    const { getMethodsOf } = pluginContext;
    const { fixtureId } = slotProps;
    const core = getMethodsOf<CoreSpec>('core');
    const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
    const rendererUrl = rendererCore.getRendererUrl();

    const onSelect = React.useCallback(() => {
      if (rendererUrl) {
        const fixtureUrl = createWebRendererUrl({
          rendererUrl,
          fixtureId,
          locked: true,
        });
        // noopener is required to prevent reuse of sessionStorage from the
        // Playground window, thus making sure the remote renderer will generate
        // a different rendererId from the iframe renderer.
        // https://stackoverflow.com/a/73821739
        window.open(fixtureUrl, '_blank', 'noopener=true');
      }
    }, [fixtureId, rendererUrl]);

    React.useEffect(() => {
      return core.registerCommands({ goFullScreen: onSelect });
    }, [core, onSelect]);

    return rendererUrl ? <FullScreenButton onClick={onSelect} /> : null;
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();
