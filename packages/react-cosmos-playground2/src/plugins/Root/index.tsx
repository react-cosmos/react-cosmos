import React from 'react';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { isNavOpen, openNav } from './navOpen';
import { getNavWidthApi } from './navWidth';
import { isPanelOpen, openPanel } from './panelOpen';
import { getPanelWidthApi } from './panelWidth';
import { RootSpec } from './public';
import { Root } from './Root';
import { RootContext } from './shared';

const { onLoad, plug, register } = createPlugin<RootSpec>({
  name: 'root',
  defaultConfig: {
    controlPanelRowOrder: [],
    globalActionOrder: [],
    globalOrder: [],
    navRowOrder: [],
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

  const fixtureTree = useFixtureTree(pluginContext);
  const onToggleNav = useOpenNav(pluginContext);
  const onTogglePanel = useOpenPanel(pluginContext);

  const { storageCacheReady } = getState();
  if (!storageCacheReady) {
    return (
      <Root
        storageCacheReady={false}
        fixtureTree={fixtureTree}
        selectedFixtureId={null}
        rendererConnected={false}
        validFixtureSelected={false}
        fixtureState={{}}
        navOpen={false}
        panelOpen={false}
        navWidth={0}
        panelWidth={0}
        controlPanelRowOrder={[]}
        globalActionOrder={[]}
        globalOrder={[]}
        navRowOrder={[]}
        rendererActionOrder={[]}
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

  const { navWidth, setNavWidth } = getNavWidthApi(pluginContext);
  const { panelWidth, setPanelWidth } = getPanelWidthApi(pluginContext);
  const {
    controlPanelRowOrder,
    globalActionOrder,
    globalOrder,
    navRowOrder,
    rendererActionOrder,
  } = getConfig();
  return (
    <Root
      storageCacheReady={true}
      fixtureTree={fixtureTree}
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      fixtureState={rendererCore.getFixtureState()}
      navOpen={isNavOpen(pluginContext)}
      panelOpen={isPanelOpen(pluginContext)}
      navWidth={navWidth}
      panelWidth={panelWidth}
      controlPanelRowOrder={controlPanelRowOrder}
      globalActionOrder={globalActionOrder}
      globalOrder={globalOrder}
      navRowOrder={navRowOrder}
      rendererActionOrder={rendererActionOrder}
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

function useFixtureTree(context: RootContext) {
  const { getMethodsOf } = context;

  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();

  return React.useMemo(
    () => createFixtureTree({ fixturesDir, fixtureFileSuffix, fixtures }),
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
