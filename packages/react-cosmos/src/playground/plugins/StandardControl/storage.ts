import React from 'react';
import { PluginContext } from 'react-plugin';
import { StandardControlSpec } from '../../../ui/specs/StandardControlSpec';
import { StorageSpec } from '../../../ui/specs/StorageSpec';
import { TreeExpansion } from '../../shared/treeExpansion';

const storageKey = 'standardControlTreeExpansion';
const emptyTreeExpansion = {};

// TODO: Persist tree expansion state per fixture ID?
export function useTreeExpansionStorage(
  pluginContext: PluginContext<StandardControlSpec>
) {
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');

  const expansion =
    storage.getItem<TreeExpansion>(storageKey) || emptyTreeExpansion;

  const setExpansion = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      storage.setItem(storageKey, newTreeExpansion),
    [storage]
  );

  return { expansion, setExpansion };
}
