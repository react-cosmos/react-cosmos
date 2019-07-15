import React from 'react';
import { createPlugin, PluginContext } from 'react-plugin';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { StorageSpec } from '../Storage/public';
import { RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { TREE_EXPANSION_STORAGE_KEY } from './shared';
import { FixtureTreeSpec } from './public';
import { FixtureTreeContainer } from './FixtureTreeContainer';

const DEFAULT_TREE_EXPANSION = {};

const { namedPlug, register } = createPlugin<FixtureTreeSpec>({
  name: 'fixtureTree'
});

namedPlug('navRow', 'fixtureTree', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const router = getMethodsOf<RouterSpec>('router');
  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const { treeExpansion, setTreeExpansion } = useTreeExpansion(pluginContext);

  return (
    <FixtureTreeContainer
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      fixtures={rendererCore.getFixtures()}
      treeExpansion={treeExpansion}
      selectFixture={router.selectFixture}
      setTreeExpansion={setTreeExpansion}
    />
  );
});

export { register };

function useTreeExpansion(pluginContext: PluginContext<FixtureTreeSpec>) {
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');
  const treeExpansion =
    storage.getItem<TreeExpansion>(TREE_EXPANSION_STORAGE_KEY) ||
    DEFAULT_TREE_EXPANSION;
  const setTreeExpansion = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      storage.setItem(TREE_EXPANSION_STORAGE_KEY, newTreeExpansion),
    [storage]
  );
  return { treeExpansion, setTreeExpansion };
}
