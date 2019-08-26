import React from 'react';
import { createPlugin, PluginContext } from 'react-plugin';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { CustomStatePanel } from './CustomStatePanel';
import { CustomStatePanelSpec } from './public';

export const CUSTOM_STATE_TREE_EXPANSION_STORAGE_KEY =
  'customStateTreeExpansion';

const { namedPlug, register } = createPlugin<CustomStatePanelSpec>({
  name: 'customStatePanel'
});

namedPlug('controlPanelRow', 'customState', ({ pluginContext }) => {
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
    <CustomStatePanel
      fixtureState={fixtureState}
      treeExpansion={treeExpansion}
      onFixtureStateChange={rendererCore.setFixtureState}
      onTreeExpansionChange={onTreeExpansionChange}
    />
  );
});

export { register };

function useTreeExpansionStorage(
  pluginContext: PluginContext<CustomStatePanelSpec>
) {
  // TODO: Persist tree expansion state per fixture ID
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');
  const treeExpansion =
    storage.getItem<TreeExpansion>(CUSTOM_STATE_TREE_EXPANSION_STORAGE_KEY) ||
    {};
  const onTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) => {
      storage.setItem(
        CUSTOM_STATE_TREE_EXPANSION_STORAGE_KEY,
        newTreeExpansion
      );
    },
    [storage]
  );
  return { treeExpansion, onTreeExpansionChange };
}
