import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin, PluginContext } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { FixtureTreeSpec } from '../FixtureTree/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { FixtureSearchHeader } from './FixtureSearchHeader';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';
import { FixtureSearchSpec } from './public';

type FixtureSearchContext = PluginContext<FixtureSearchSpec>;

const { onLoad, namedPlug, register } = createPlugin<FixtureSearchSpec>({
  name: 'fixtureSearch',
  initialState: {
    open: false,
    searchText: ''
  }
});

onLoad(pluginContext => {
  const { getMethodsOf, setState } = pluginContext;
  const core = getMethodsOf<CoreSpec>('core');
  return core.registerCommands({
    searchFixtures: () => setState(prevState => ({ ...prevState, open: true }))
  });
});

namedPlug('navRow', 'fixtureSearch', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();
  const onOpen = useOnOpen(pluginContext);

  // No point in showing fixture search button unless user has fixtures
  if (Object.keys(fixtures).length === 0) {
    return null;
  }

  return <FixtureSearchHeader onOpen={onOpen} />;
});

namedPlug('global', 'fixtureSearch', ({ pluginContext }) => {
  const { getState, getMethodsOf } = pluginContext;
  const { open, searchText } = getState();
  const core = getMethodsOf<CoreSpec>('core');
  const router = getMethodsOf<RouterSpec>('router');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtures = rendererCore.getFixtures();

  const onSetSearchText = useOnSetSearchText(pluginContext);
  const onClose = useOnClose(pluginContext);
  const onSelect = useOnSelect(pluginContext);

  if (!open) {
    return null;
  }

  return (
    <FixtureSearchOverlay
      searchText={searchText}
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={router.getSelectedFixtureId()}
      onSetSearchText={onSetSearchText}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
});

export { register };

function useOnSetSearchText({ setState }: FixtureSearchContext) {
  return React.useCallback(
    (newSearchText: string) => {
      setState(prevState => ({ ...prevState, searchText: newSearchText }));
    },
    [setState]
  );
}

function useOnOpen({ setState }: FixtureSearchContext) {
  return React.useCallback(
    () => setState(prevState => ({ ...prevState, open: true })),
    [setState]
  );
}

function useOnClose({ setState }: FixtureSearchContext) {
  return React.useCallback(
    () => setState(prevState => ({ ...prevState, open: false })),
    [setState]
  );
}

function useOnSelect(pluginContext: FixtureSearchContext) {
  const { setState, getMethodsOf } = pluginContext;
  const router = getMethodsOf<RouterSpec>('router');
  const fixtureTree = getMethodsOf<FixtureTreeSpec>('fixtureTree');

  return React.useCallback(
    (fixtureId: FixtureId, revealFixture: boolean) => {
      router.selectFixture(fixtureId);
      if (revealFixture) {
        fixtureTree.revealFixture(fixtureId);
      }
      setState(prevState => ({ ...prevState, open: false }));
    },
    [setState, fixtureTree, router]
  );
}
