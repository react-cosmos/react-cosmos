import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  CoreSpec,
  FixtureSearchSpec,
  FixtureTreeSpec,
  RendererCoreSpec,
  RouterSpec,
} from 'react-cosmos-shared2/ui';
import { createPlugin, PluginContext } from 'react-plugin';
import { NavRowSlotProps } from '../../shared/slots/NavRowSlot';
import { FixtureSearchHeader } from './FixtureSearchHeader';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';

type FixtureSearchContext = PluginContext<FixtureSearchSpec>;

const { onLoad, namedPlug, register } = createPlugin<FixtureSearchSpec>({
  name: 'fixtureSearch',
  initialState: {
    open: false,
    searchText: '',
  },
});

onLoad(pluginContext => {
  const { getMethodsOf, setState } = pluginContext;
  const core = getMethodsOf<CoreSpec>('core');
  return core.registerCommands({
    searchFixtures: () => setState(prevState => ({ ...prevState, open: true })),
  });
});

namedPlug<NavRowSlotProps>(
  'navRow',
  'fixtureSearch',
  ({ pluginContext, slotProps }) => {
    const { getMethodsOf } = pluginContext;
    const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
    const fixtures = rendererCore.getFixtures();
    const onOpen = useOnOpen(pluginContext);
    const { onCloseNav } = slotProps;

    // No point in showing fixture search button unless user has fixtures
    if (Object.keys(fixtures).length === 0) {
      return null;
    }

    return (
      <FixtureSearchHeader
        validFixtureSelected={rendererCore.isValidFixtureSelected()}
        onOpen={onOpen}
        onCloseNav={onCloseNav}
      />
    );
  }
);

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

register();

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

function useOnSelect(context: FixtureSearchContext) {
  const { setState, getMethodsOf } = context;
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
