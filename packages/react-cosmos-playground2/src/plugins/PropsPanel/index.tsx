import React from 'react';
import {
  FixtureElementId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { createPlugin } from 'react-plugin';
import { TreeExpansion } from '../../shared/ui/TreeView';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  updateElementExpansion
} from '../../shared/ui/valueInputTree';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { PropsPanel } from './PropsPanel';
import { PropsPanelSpec } from './public';
import { PROPS_TREE_EXPANSION_STORAGE_KEY } from './shared';

const { plug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel'
});

plug('controlPanelRow', ({ pluginContext: { getMethodsOf } }) => {
  const routerCore = getMethodsOf<RouterSpec>('router');
  const selectedFixtureId = routerCore.getSelectedFixtureId();
  if (selectedFixtureId === null) {
    return null;
  }

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const onFixtureStateChange = React.useCallback(
    (fixtureStateUpdater: StateUpdater<FixtureState>) =>
      rendererCore.setFixtureState(fixtureStateUpdater),
    [rendererCore]
  );

  const storage = getMethodsOf<StorageSpec>('storage');
  const propsExpansion =
    storage.getItem<FixtureExpansionGroup>(PROPS_TREE_EXPANSION_STORAGE_KEY) ||
    {};
  const onElementExpansionChange = React.useCallback(
    (elementId: FixtureElementId, treeExpansion: TreeExpansion) => {
      storage.setItem(
        PROPS_TREE_EXPANSION_STORAGE_KEY,
        updateElementExpansion(
          propsExpansion,
          selectedFixtureId,
          elementId,
          treeExpansion
        )
      );
    },
    [storage, propsExpansion, selectedFixtureId]
  );

  return (
    <PropsPanel
      fixtureState={fixtureState}
      fixtureExpansion={getFixtureExpansion(propsExpansion, selectedFixtureId)}
      onFixtureStateChange={onFixtureStateChange}
      onElementExpansionChange={onElementExpansionChange}
    />
  );
});

export { register };
