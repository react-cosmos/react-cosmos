import React from 'react';
import { createPlugin, PluginContext } from 'react-plugin';
import { ControlPanelRowSlotProps } from '../../shared/slots/ControlPanelRowSlot';
import { TreeExpansion } from '../../shared/TreeView';
import { StorageSpec } from '../Storage/public';
import { ValuesPanelSpec } from './public';
import { ValuesPanel } from './ValuesPanel';

type ValuesPanelContext = PluginContext<ValuesPanelSpec>;

export const VALUES_TREE_EXPANSION_STORAGE_KEY = 'valuesTreeExpansion';

const { namedPlug, register } = createPlugin<ValuesPanelSpec>({
  name: 'valuesPanel',
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'values',
  ({ pluginContext, slotProps }) => {
    const { fixtureState, onFixtureStateChange } = slotProps;
    const { treeExpansion, onTreeExpansionChange } = useTreeExpansionStorage(
      pluginContext
    );
    return (
      <ValuesPanel
        fixtureState={fixtureState}
        treeExpansion={treeExpansion}
        onFixtureStateChange={onFixtureStateChange}
        onTreeExpansionChange={onTreeExpansionChange}
      />
    );
  }
);

export { register };

// TODO: Persist tree expansion state per fixture ID
function useTreeExpansionStorage(context: ValuesPanelContext) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');

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
