import React from 'react';
import { createPlugin, PluginContext } from 'react-plugin';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { ValuesPanel } from './ValuesPanel';
import { ValuesPanelSpec } from './public';

export const VALUES_TREE_EXPANSION_STORAGE_KEY = 'valuesTreeExpansion';

const { namedPlug, register } = createPlugin<ValuesPanelSpec>({
  name: 'valuesPanel'
});

namedPlug('controlPanelRow', 'values', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const routerCore = getMethodsOf<RouterSpec>('router');
  const selectedFixtureId = routerCore.getSelectedFixtureId();
  if (selectedFixtureId === null) {
    return null;
  }

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const { treeExpansion, onTreeExpansionChange } = useTreeExpansionStorage(
    pluginContext
  );
  return (
    <ValuesPanel
      fixtureState={fixtureState}
      treeExpansion={treeExpansion}
      onFixtureStateChange={rendererCore.setFixtureState}
      onTreeExpansionChange={onTreeExpansionChange}
    />
  );
});

export { register };

function useTreeExpansionStorage(
  pluginContext: PluginContext<ValuesPanelSpec>
) {
  // TODO: Persist tree expansion state per fixture ID
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');
  const treeExpansion =
    storage.getItem<TreeExpansion>(VALUES_TREE_EXPANSION_STORAGE_KEY) || {};
  const onTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) => {
      storage.setItem(VALUES_TREE_EXPANSION_STORAGE_KEY, newTreeExpansion);
    },
    [storage]
  );
  return { treeExpansion, onTreeExpansionChange };
}
