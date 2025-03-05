import React from 'react';
import { createFixtureTree, flattenFixtureTree } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RouterSpec } from '../Router/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { useWelcomeDismiss } from './HomeOverlay/welcomeDismiss.js';
import { Root } from './Root.js';
import {
  isControlPanelOpen,
  openControlPanel,
} from './persistentState/controlPanelOpen.js';
import {
  getControlPanelWidth,
  setControlPanelWidth,
} from './persistentState/controlPanelWidth.js';
import {
  isNavPanelOpen,
  openNavPanel,
} from './persistentState/navPanelOpen.js';
import {
  getNavPanelWidth,
  setNavPanelWidth,
} from './persistentState/navPanelWidth.js';
import {
  arePanelsLocked,
  setPanelsLocked,
} from './persistentState/panelsLocked.js';
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
  methods: {
    arePanelsLocked,
    closeNavPanel,
  },
});

function closeNavPanel(context: RootContext) {
  openNavPanel(context, false);
}

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
    toggleNavPanel: () => openNavPanel(context, !isNavPanelOpen(context)),
    toggleControlPanel: () =>
      openControlPanel(context, !isControlPanelOpen(context)),
  });
});

plug('root', ({ pluginContext }) => {
  const { getConfig, getState, getMethodsOf } = pluginContext;
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  const fixtureItems = useFixtureItems(pluginContext);
  const onToggleNavPanel = useToggleNavPanel(pluginContext);
  const onToggleControlPanel = useToggleControlPanel(pluginContext);
  const welcomeDismiss = useWelcomeDismiss(pluginContext);

  const { storageCacheReady } = getState();
  if (!storageCacheReady) return null;

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
      getFixtureState={rendererCore.getFixtureState}
      setFixtureState={rendererCore.setFixtureState}
      navPanelOpen={isNavPanelOpen(pluginContext)}
      controlPanelOpen={isControlPanelOpen(pluginContext)}
      navPanelWidth={getNavPanelWidth(pluginContext)}
      controlPanelWidth={getControlPanelWidth(pluginContext)}
      panelsLocked={arePanelsLocked(pluginContext)}
      sidePanelRowOrder={sidePanelRowOrder}
      globalActionOrder={globalActionOrder}
      globalOrder={globalOrder}
      navRowOrder={navRowOrder}
      fixtureActionOrder={fixtureActionOrder}
      rendererActionOrder={rendererActionOrder}
      onToggleNavPanel={onToggleNavPanel}
      onToggleControlPanel={onToggleControlPanel}
      onReloadRenderer={rendererCore.reloadRenderer}
      onCloseFixture={router.unselectFixture}
      setNavPanelWidth={width => setNavPanelWidth(pluginContext, width)}
      setControlPanelWidth={width => setControlPanelWidth(pluginContext, width)}
      setPanelsLocked={locked => setPanelsLocked(pluginContext, locked)}
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

function useToggleNavPanel(context: RootContext) {
  return React.useCallback(() => {
    openNavPanel(context, !isNavPanelOpen(context));
  }, [context]);
}

function useToggleControlPanel(context: RootContext) {
  return React.useCallback(() => {
    openControlPanel(context, !isControlPanelOpen(context));
  }, [context]);
}
