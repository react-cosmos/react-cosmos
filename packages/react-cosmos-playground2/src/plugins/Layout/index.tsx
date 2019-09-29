import React from 'react';
import { createPlugin } from 'react-plugin';
import { SlidersIcon } from '../../shared/icons';
import { IconButton32 } from '../../shared/ui/buttons';
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

const { onLoad, plug, namedPlug, register } = createPlugin<LayoutSpec>({
  name: 'layout',
  defaultConfig: {
    globalOrder: [],
    topBarRightActionOrder: [],
    rendererActionOrder: [],
    controlPanelRowOrder: []
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
        selectedFixtureId={null}
        fullScreen={false}
        rendererConnected={false}
        validFixtureSelected={false}
        fixtureState={{}}
        navOpen={false}
        panelOpen={false}
        navWidth={0}
        panelWidth={0}
        globalOrder={[]}
        topBarRightActionOrder={[]}
        rendererActionOrder={[]}
        controlPanelRowOrder={[]}
        onToggleNav={() => {}}
        onFixtureSelect={() => {}}
        onFixtureClose={() => {}}
        onFixtureStateChange={() => {}}
        setNavWidth={() => {}}
        setPanelWidth={() => {}}
      />
    );
  }

  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const { navWidth, setNavWidth } = getNavWidthApi(pluginContext);
  const { panelWidth, setPanelWidth } = getPanelWidthApi(pluginContext);
  const {
    globalOrder,
    topBarRightActionOrder,
    rendererActionOrder,
    controlPanelRowOrder
  } = getConfig();
  return (
    <Layout
      storageCacheReady={true}
      selectedFixtureId={router.getSelectedFixtureId()}
      fullScreen={router.isFullScreen()}
      rendererConnected={rendererCore.isRendererConnected()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      fixtureState={rendererCore.getFixtureState()}
      navOpen={isNavOpen(pluginContext)}
      panelOpen={isPanelOpen(pluginContext)}
      navWidth={navWidth}
      panelWidth={panelWidth}
      globalOrder={globalOrder}
      topBarRightActionOrder={topBarRightActionOrder}
      rendererActionOrder={rendererActionOrder}
      controlPanelRowOrder={controlPanelRowOrder}
      onToggleNav={onToggleNav}
      onFixtureSelect={router.selectFixture}
      onFixtureClose={router.unselectFixture}
      onFixtureStateChange={rendererCore.setFixtureState}
      setNavWidth={setNavWidth}
      setPanelWidth={setPanelWidth}
    />
  );
});

namedPlug('rendererAction', 'controlPanel', ({ pluginContext }) => {
  const onToggleNav = useOpenPanel(pluginContext);
  return (
    <IconButton32
      icon={<SlidersIcon />}
      title="Open control panel"
      selected={isPanelOpen(pluginContext)}
      onClick={onToggleNav}
    />
  );
});

export { register };

function useOpenNav(pluginContext: LayoutContext) {
  return React.useCallback(() => {
    openNav(pluginContext, !isNavOpen(pluginContext));
  }, [pluginContext]);
}

function useOpenPanel(pluginContext: LayoutContext) {
  return React.useCallback(() => {
    openPanel(pluginContext, !isPanelOpen(pluginContext));
  }, [pluginContext]);
}
