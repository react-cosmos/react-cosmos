import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererActionSlotProps } from '../../../ui/slots/RendererActionSlot';
import { CoreSpec } from '../../../ui/specs/CoreSpec';
import { FullScreenButtonSpec } from '../../../ui/specs/FullScreenButtonSpec';
import { stringifyRendererUrlQuery } from '../../playgroundUrl';
import { FullScreenButton } from './FullScreenButton';

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

register();
