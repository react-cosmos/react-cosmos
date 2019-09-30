import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { Root } from './Layout';
import { isNavOpen, openNav } from './navOpen';
import { getNavWidthApi } from './navWidth';
import { isPanelOpen, openPanel } from './panelOpen';
import { getPanelWidthApi } from './panelWidth';
import { RootSpec } from './public';
import { RootContext } from './shared';

const { onLoad, plug, register } = createPlugin<RootSpec>({
  name: 'root',
  defaultConfig: {
    globalOrder: [],
    topBarRightActionOrder: [],
    rendererActionOrder: [],
    controlPanelRowOrder: []
  },
  initialState: {
    storageCacheReady: false
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
  const onTogglePanel = useOpenPanel(pluginContext);

  const { storageCacheReady } = getState();
  if (!storageCacheReady) {
    return (
      <Root
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
        onTogglePanel={() => {}}
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
    <Root
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
      onTogglePanel={onTogglePanel}
      onFixtureSelect={router.selectFixture}
      onFixtureClose={router.unselectFixture}
      onFixtureStateChange={rendererCore.setFixtureState}
      setNavWidth={setNavWidth}
      setPanelWidth={setPanelWidth}
    />
  );
});

export { register };

function useOpenNav(pluginContext: RootContext) {
  return React.useCallback(() => {
    openNav(pluginContext, !isNavOpen(pluginContext));
  }, [pluginContext]);
}

function useOpenPanel(pluginContext: RootContext) {
  return React.useCallback(() => {
    openPanel(pluginContext, !isPanelOpen(pluginContext));
  }, [pluginContext]);
}
