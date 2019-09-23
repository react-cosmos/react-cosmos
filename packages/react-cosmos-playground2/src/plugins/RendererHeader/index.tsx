import React from 'react';
import { PluginContext, createPlugin } from 'react-plugin';
import { LayoutSpec } from '../Layout/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { RendererHeaderSpec } from './public';
import { RendererHeader } from './RendererHeader';

const { plug, register } = createPlugin<RendererHeaderSpec>({
  name: 'rendererHeader',
  defaultConfig: {
    rendererActionOrder: []
  }
});

plug('rendererHeader', ({ pluginContext }) => {
  const { getConfig, getMethodsOf } = pluginContext;
  const { rendererActionOrder } = getConfig();
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const { navOpen, onToggleNav } = useNavToggle(pluginContext);
  return (
    <RendererHeader
      rendererActionOrder={rendererActionOrder}
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      navOpen={navOpen}
      selectFixture={router.selectFixture}
      unselectFixture={router.unselectFixture}
      onToggleNav={onToggleNav}
    />
  );
});

export { register };

function useNavToggle(pluginContext: PluginContext<RendererHeaderSpec>) {
  const layout = pluginContext.getMethodsOf<LayoutSpec>('layout');
  const { isNavOpen, openNav } = layout;
  const navOpen = isNavOpen();
  const onToggleNav = React.useCallback(() => {
    openNav(!navOpen);
  }, [navOpen, openNav]);
  return { navOpen, onToggleNav };
}
