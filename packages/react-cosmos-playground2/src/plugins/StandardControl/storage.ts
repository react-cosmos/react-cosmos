import React from 'react';
import { PluginContext } from 'react-plugin';
import { TreeExpansion } from '../../shared/TreeView';
import { StorageSpec } from '../Storage/public';
import { StandardControlSpec } from './public';

const treeExpansionStorageKey = 'standardControlTreeExpansion';
const emptyTreeExpansion = {};

// TODO: Persist tree expansion state per fixture ID
export function useTreeExpansionStorage(
  pluginContext: PluginContext<StandardControlSpec>
) {
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');

  const treeExpansion =
    storage.getItem<TreeExpansion>(treeExpansionStorageKey) ||
    emptyTreeExpansion;

  const onTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      storage.setItem(treeExpansionStorageKey, newTreeExpansion),
    [storage]
  );

  return { treeExpansion, onTreeExpansionChange };
}
