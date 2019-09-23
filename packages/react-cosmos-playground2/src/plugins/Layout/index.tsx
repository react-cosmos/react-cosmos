import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { Layout } from './Layout';
import { isNavOpen, openNav } from './navOpen';
import { getNavWidthApi } from './navWidth';
import { isPanelOpen, openPanel } from './panelOpen';
import { getPanelWidthApi } from './panelWidth';
import { LayoutSpec } from './public';
import { LayoutContext } from './shared';

const { onLoad, plug, register } = createPlugin<LayoutSpec>({
  name: 'layout',
  defaultConfig: {
    globalOrder: []
  },
  initialState: {
    storageCacheReady: false
  },
  methods: {
    isNavOpen,
    isPanelOpen,
    openNav,
    openPanel
  }
});

onLoad(context => {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const core = context.getMethodsOf<CoreSpec>('core');
  storage.loadCache(core.getProjectId()).then(() => {
    context.setState({ storageCacheReady: true });
  });
});

plug('root', ({ pluginContext }) => {
  const { getConfig, getState, getMethodsOf } = pluginContext;
  const onToggleNav = useOpenNav(pluginContext);

  const { storageCacheReady } = getState();
  if (!storageCacheReady) {
    return (
      <Layout
        storageCacheReady={false}
        fullScreen={false}
        validFixtureSelected={false}
        navOpen={false}
        panelOpen={false}
        navWidth={0}
        panelWidth={0}
        globalOrder={[]}
        onToggleNav={() => {}}
        setNavWidth={() => {}}
        setPanelWidth={() => {}}
      />
    );
  }

  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const { navWidth, setNavWidth } = getNavWidthApi(pluginContext);
  const { panelWidth, setPanelWidth } = getPanelWidthApi(pluginContext);
  return (
    <Layout
      storageCacheReady={true}
      fullScreen={router.isFullScreen()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      navOpen={isNavOpen(pluginContext)}
      panelOpen={isPanelOpen(pluginContext)}
      navWidth={navWidth}
      panelWidth={panelWidth}
      globalOrder={getConfig().globalOrder}
      onToggleNav={onToggleNav}
      setNavWidth={setNavWidth}
      setPanelWidth={setPanelWidth}
    />
  );
});

export { register };

function useOpenNav(pluginContext: LayoutContext) {
  return React.useCallback(() => {
    openNav(pluginContext, !isNavOpen(pluginContext));
  }, [pluginContext]);
}
