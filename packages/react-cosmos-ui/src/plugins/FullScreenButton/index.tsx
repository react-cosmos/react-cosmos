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
      const query = stringifyRendererUrlQuery({ _fixtureId: fixtureId });
      const fixtureUrl = `${rendererUrl}?${query}`;
      window.open(fixtureUrl, '_blank');
    }, [fixtureId, rendererUrl]);

    React.useEffect(() => {
      return core.registerCommands({ goFullScreen: onSelect });
    }, [core, onSelect]);

    return rendererUrl ? <FullScreenButton onClick={onSelect} /> : null;
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();
