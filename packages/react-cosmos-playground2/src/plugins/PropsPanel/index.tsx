import React from 'react';
import { createPlugin } from 'react-plugin';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureState,
  FixtureElementId
} from 'react-cosmos-shared2/fixtureState';
import { StorageSpec } from '../Storage/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { TreeExpansion } from '../../shared/ui';
import { PropsPanelSpec } from './public';
import { PropsPanel } from './PropsPanel';
import { stringifyElementId, TreeExpansionGroup } from './shared';

const PROPS_TREE_EXPANSION_STORAGE_KEY = 'propsTreeExpansion';

const { plug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel'
});

plug('controlPanelRow', ({ pluginContext: { getMethodsOf } }) => {
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const onFixtureStateChange = React.useCallback(
    (fixtureStateUpdater: StateUpdater<FixtureState>) =>
      rendererCore.setFixtureState(fixtureStateUpdater),
    [rendererCore]
  );

  const storage = getMethodsOf<StorageSpec>('storage');
  const treeExpansion =
    storage.getItem<TreeExpansionGroup>(PROPS_TREE_EXPANSION_STORAGE_KEY) || {};
  const onTreeExpansionChange = React.useCallback(
    (elementId: FixtureElementId, newTreeExpansion: TreeExpansion) => {
      storage.setItem(PROPS_TREE_EXPANSION_STORAGE_KEY, {
        ...treeExpansion,
        [stringifyElementId(elementId)]: newTreeExpansion
      });
    },
    [storage, treeExpansion]
  );

  return (
    <PropsPanel
      fixtureState={fixtureState}
      treeExpansion={treeExpansion}
      onFixtureStateChange={onFixtureStateChange}
      onTreeExpansionChange={onTreeExpansionChange}
    />
  );
});

export { register };
