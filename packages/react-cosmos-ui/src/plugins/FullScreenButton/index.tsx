import React from 'react';
import { stringifyRendererUrlQuery } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { RendererActionSlotProps } from '../../slots/RendererActionSlot.js';
import { CoreSpec } from '../Core/spec.js';
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
    const rendererUrl = core.getWebRendererUrl();

    const onSelect = React.useCallback(() => {
      const query = stringifyRendererUrlQuery({ fixtureId, locked: true });
      const fixtureUrl = `${rendererUrl}?${query}`;
      // noopener is required to prevent reuse of sessionStorage from the
      // Playground window, thus making sure the remote renderer will generate
      // a different rendererId from the iframe renderer.
      // https://stackoverflow.com/a/73821739
      window.open(fixtureUrl, '_blank', 'noopener=true');
    }, [fixtureId, rendererUrl]);

    React.useEffect(() => {
      return core.registerCommands({ goFullScreen: onSelect });
    }, [core, onSelect]);

    return rendererUrl ? <FullScreenButton onClick={onSelect} /> : null;
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();
