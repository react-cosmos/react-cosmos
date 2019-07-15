import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/public';
import { Nav } from './Nav';
import { NavSpec } from './public';

const { plug, register } = createPlugin<NavSpec>({
  name: 'nav',
  defaultConfig: {
    navRowOrder: []
  }
});

plug('nav', ({ pluginContext }) => {
  const { getConfig, getMethodsOf } = pluginContext;
  const { navRowOrder } = getConfig();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  return (
    <Nav
      rendererConnected={rendererCore.isRendererConnected()}
      navRowOrder={navRowOrder}
    />
  );
});

export { register };
