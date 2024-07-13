import React from 'react';
import { PluginContext } from 'react-plugin';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { StorageSpec } from '../Storage/spec.js';
import { StandardInputSpec } from './spec.js';

const storageKey = 'standardInputTreeExpansion';
const emptyTreeExpansion = {};

// TODO: Persist tree expansion state per fixture ID?
export function useTreeExpansionStorage(
  pluginContext: PluginContext<StandardInputSpec>
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
