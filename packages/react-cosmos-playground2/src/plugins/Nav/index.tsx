import React from 'react';
import { createPlugin } from 'react-plugin';
import { NavSlotProps } from '../../shared/slots/NavSlot';
import { RendererCoreSpec } from '../RendererCore/public';
import { Nav } from './Nav';
import { NavSpec } from './public';

const { plug, register } = createPlugin<NavSpec>({
  name: 'nav',
  defaultConfig: {
    navRowOrder: []
  }
});

plug<NavSlotProps>('nav', ({ pluginContext, slotProps }) => {
  const { getConfig, getMethodsOf } = pluginContext;
  const { navRowOrder } = getConfig();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const { onCloseNav } = slotProps;

  return (
    <Nav
      rendererConnected={rendererCore.isRendererConnected()}
      navRowOrder={navRowOrder}
      onCloseNav={onCloseNav}
    />
  );
});

export { register };
