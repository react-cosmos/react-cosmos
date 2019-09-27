import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererActionSlotProps } from '../../shared/slots/shared';
import { RouterSpec } from '../Router/public';
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
    const router = getMethodsOf<RouterSpec>('router');
    const { fixtureId } = slotProps;

    const onSelect = React.useCallback(() => {
      router.selectFixture(fixtureId, true);
    }, [fixtureId, router]);

    return <FullScreenButton onClick={onSelect} />;
  }
);

export { register };
