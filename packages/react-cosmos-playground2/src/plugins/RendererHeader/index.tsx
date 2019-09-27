import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererHeaderSlotProps } from '../../shared/slots/shared';
import { RouterSpec } from '../Router/public';
import { RendererHeaderSpec } from './public';
import { RendererHeader } from './RendererHeader';

const { plug, register } = createPlugin<RendererHeaderSpec>({
  name: 'rendererHeader',
  defaultConfig: {
    rendererActionOrder: []
  }
});

plug<RendererHeaderSlotProps>(
  'rendererHeader',
  ({ pluginContext, slotProps }) => {
    const { getConfig, getMethodsOf } = pluginContext;
    const { fixtureId } = slotProps;
    const { rendererActionOrder } = getConfig();
    const router = getMethodsOf<RouterSpec>('router');
    const { selectFixture, unselectFixture } = router;

    const onReload = React.useCallback(() => {
      selectFixture(fixtureId, false);
    }, [fixtureId, selectFixture]);

    return (
      <RendererHeader
        fixtureId={slotProps.fixtureId}
        rendererActionOrder={rendererActionOrder}
        onReload={onReload}
        onClose={unselectFixture}
      />
    );
  }
);

export { register };
