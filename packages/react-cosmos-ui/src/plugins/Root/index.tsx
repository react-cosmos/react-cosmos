import React from 'react';
import { createFixtureTree, flattenFixtureTree } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RouterSpec } from '../Router/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { useWelcomeDismiss } from './HomeOverlay/welcomeDismiss.js';
import { isNavOpen, openNav } from './navOpen.js';
import { getNavWidthApi } from './navWidth.js';
import { isPanelOpen, openPanel } from './panelOpen.js';
import { getPanelWidthApi } from './panelWidth.js';
import { Root } from './Root.js';
import { RootContext } from './shared.js';
import { RootSpec } from './spec.js';

const { onLoad, plug, register } = createPlugin<RootSpec>({
  name: 'root',
  defaultConfig: {
    sidePanelRowOrder: [],
    globalActionOrder: [],
    globalOrder: [],
    navRowOrder: [],
    fixtureActionOrder: [],
    rendererActionOrder: [],
  },
  initialState: {
    storageCacheReady: false,
  },
});

onLoad(context => {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const core = context.getMethodsOf<CoreSpec>('core');
  storage.loadCache(core.getProjectId()).then(() => {
    context.setState({ storageCacheReady: true });
  });
});

onLoad(context => {
  const core = context.getMethodsOf<CoreSpec>('core');
  return core.registerCommands({
    toggleFixtureList: () => openNav(context, !isNavOpen(context)),
    toggleControlPanel: () => openPanel(context, !isPanelOpen(context)),
  });
});

plug('root', ({ pluginContext }) => {
  const { getConfig, getState, getMethodsOf } = pluginContext;
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  const fixtureItems = useFixtureItems(pluginContext);
  const onToggleNav = useOpenNav(pluginContext);
  const onTogglePanel = useOpenPanel(pluginContext);
  const welcomeDismiss = useWelcomeDismiss(pluginContext);

  const { storageCacheReady } = getState();
  if (!storageCacheReady) return null;

  const { navWidth, setNavWidth } = getNavWidthApi(pluginContext);
  const { panelWidth, setPanelWidth } = getPanelWidthApi(pluginContext);
  const {
    sidePanelRowOrder,
    globalActionOrder,
    globalOrder,
    navRowOrder,
    fixtureActionOrder,
    rendererActionOrder,
  } = getConfig();
  return (
    <Root
      fixtureItems={fixtureItems}
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      fixtureState={rendererCore.getFixtureState()}
      navOpen={isNavOpen(pluginContext)}
      panelOpen={isPanelOpen(pluginContext)}
      navWidth={navWidth}
      panelWidth={panelWidth}
      sidePanelRowOrder={sidePanelRowOrder}
      globalActionOrder={globalActionOrder}
      globalOrder={globalOrder}
      navRowOrder={navRowOrder}
      fixtureActionOrder={fixtureActionOrder}
      rendererActionOrder={rendererActionOrder}
      onToggleNav={onToggleNav}
      onTogglePanel={onTogglePanel}
      onFixtureSelect={router.selectFixture}
      onFixtureClose={router.unselectFixture}
      onFixtureStateChange={rendererCore.setFixtureState}
      setNavWidth={setNavWidth}
      setPanelWidth={setPanelWidth}
      welcomeDismissed={welcomeDismiss.isWelcomeDismissed()}
      onDismissWelcome={welcomeDismiss.onDismissWelcome}
      onShowWelcome={welcomeDismiss.onShowWelcome}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function useFixtureItems(context: RootContext) {
  const { getMethodsOf } = context;

  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();

  return React.useMemo(
    () =>
      flattenFixtureTree(
        createFixtureTree({ fixturesDir, fixtureFileSuffix, fixtures })
      ),
    [fixtureFileSuffix, fixtures, fixturesDir]
  );
}

function useOpenNav(context: RootContext) {
  return React.useCallback(() => {
    openNav(context, !isNavOpen(context));
  }, [context]);
}

function useOpenPanel(context: RootContext) {
  return React.useCallback(() => {
    openPanel(context, !isPanelOpen(context));
  }, [context]);
}
