import React from 'react';
import { createPlugin } from 'react-plugin';
import { LayoutSpec } from '../Layout/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { MiniNav } from './MiniNav';
import { Nav } from './Nav';
import { NavSpec } from './public';

const { plug, register } = createPlugin<NavSpec>({
  name: 'nav',
  defaultConfig: {
    navRowOrder: [],
    miniNavActionOrder: []
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

plug('miniNav', ({ pluginContext }) => {
  const { getConfig, getMethodsOf } = pluginContext;
  const { miniNavActionOrder } = getConfig();
  const layout = getMethodsOf<LayoutSpec>('layout');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const onOpenNav = React.useCallback(() => layout.openNav(true), [layout]);

  return (
    <MiniNav
      rendererConnected={rendererCore.isRendererConnected()}
      miniNavActionOrder={miniNavActionOrder}
      onOpenNav={onOpenNav}
    />
  );
});

export { register };
