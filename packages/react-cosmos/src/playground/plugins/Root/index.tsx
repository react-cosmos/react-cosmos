import React from 'react';
import { createPlugin } from 'react-plugin';
import { createFixtureTree } from '../../../utils/fixtureTree/createFixtureTree';
import { flattenFixtureTree } from '../../../utils/fixtureTree/flattenFixtureTree';
import { CoreSpec } from '../Core/spec';
import { RendererCoreSpec } from '../RendererCore/spec';
import { RouterSpec } from '../Router/spec';
import { StorageSpec } from '../Storage/spec';
import { isNavOpen, openNav } from './navOpen';
import { getNavWidthApi } from './navWidth';
import { isPanelOpen, openPanel } from './panelOpen';
import { getPanelWidthApi } from './panelWidth';
import { Root } from './Root';
import { RootContext } from './shared';
import { RootSpec } from './spec';

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

  const { storageCacheReady } = getState();
  if (!storageCacheReady) {
    return (
      <Root
        storageCacheReady={false}
        fixtureItems={[]}
        selectedFixtureId={null}
        rendererConnected={false}
        validFixtureSelected={false}
        fixtureState={{}}
        navOpen={false}
        panelOpen={false}
        navWidth={0}
        panelWidth={0}
        sidePanelRowOrder={[]}
        globalActionOrder={[]}
        globalOrder={[]}
        navRowOrder={[]}
        fixtureActionOrder={[]}
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
    sidePanelRowOrder,
    globalActionOrder,
    globalOrder,
    navRowOrder,
    fixtureActionOrder,
    rendererActionOrder,
  } = getConfig();
  return (
    <Root
      storageCacheReady={true}
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
    />
  );
});

register();

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
