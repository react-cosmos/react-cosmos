import React from 'react';
import { createFixtureTree, flattenFixtureTree } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RouterSpec } from '../Router/spec.js';
import { StorageSpec } from '../Storage/spec.js';
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
  getControlPanelPosition,
  setControlPanelPosition,
} from './persistentState/controlPanelPosition.js';
import {
  drawerPanelsEnabled,
  setDrawerPanels,
} from './persistentState/drawerPanels.js';
import {
  isNavPanelOpen,
  setNavPanelState,
} from './persistentState/navPanelOpen.js';
import {
  getNavPanelWidth,
  setNavPanelWidth,
} from './persistentState/navPanelWidth.js';
import { RootContext } from './shared.js';
import { RootSpec } from './spec.js';

const { onLoad, plug, register } = createPlugin<RootSpec>({
  name: 'root',
  defaultConfig: {
    globalActionOrder: [],
    globalOrder: [],
    navPanelRowOrder: [],
    controlPanelRowOrder: [],
    fixtureActionOrder: [],
    rendererActionOrder: [],
  },
  initialState: {
    storageCacheReady: false,
  },
  methods: {
    drawerPanelsEnabled,
    navPanelOpen,
    closeNavPanel,
    openNavPanel,
  },
});

function navPanelOpen(context: RootContext) {
  return isNavPanelOpen(context);
}

function closeNavPanel(context: RootContext) {
  setNavPanelState(context, false);
}

function openNavPanel(context: RootContext) {
  setNavPanelState(context, true);
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
    toggleNavPanel: () => setNavPanelState(context, !isNavPanelOpen(context)),
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

  const { storageCacheReady } = getState();
  if (!storageCacheReady) return null;

  const {
    globalActionOrder,
    globalOrder,
    navPanelRowOrder,
    controlPanelRowOrder,
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
      controlPanelPosition={getControlPanelPosition(pluginContext)}
      drawerPanels={drawerPanelsEnabled(pluginContext)}
      globalActionOrder={globalActionOrder}
      globalOrder={globalOrder}
      navPanelRowOrder={navPanelRowOrder}
      controlPanelRowOrder={controlPanelRowOrder}
      fixtureActionOrder={fixtureActionOrder}
      rendererActionOrder={rendererActionOrder}
      onToggleNavPanel={onToggleNavPanel}
      onToggleControlPanel={onToggleControlPanel}
      onReloadRenderer={rendererCore.reloadRenderer}
      onCloseFixture={router.unselectFixture}
      setNavPanelWidth={width => setNavPanelWidth(pluginContext, width)}
      setControlPanelWidth={width => setControlPanelWidth(pluginContext, width)}
      setControlPanelPosition={position => setControlPanelPosition(pluginContext, position)}
      setDrawerPanels={enabled => setDrawerPanels(pluginContext, enabled)}
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
    setNavPanelState(context, !isNavPanelOpen(context));
  }, [context]);
}

function useToggleControlPanel(context: RootContext) {
  return React.useCallback(() => {
    openControlPanel(context, !isControlPanelOpen(context));
  }, [context]);
}
