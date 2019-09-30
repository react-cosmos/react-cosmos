import React from 'react';
import { stringifyRendererUrlQuery } from 'react-cosmos-shared2/url';
import { createPlugin } from 'react-plugin';
import { RendererActionSlotProps } from '../../shared/slots/RendererActionSlot';
import { CoreSpec } from '../Core/public';
import { FullScreenButton } from './FullScreenButton';
import { FullScreenButtonSpec } from './public';

const { namedPlug, register } = createPlugin<FullScreenButtonSpec>({
  name: 'fullScreenButton'
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

    return <FullScreenButton onClick={onSelect} />;
  }
);

export { register };
