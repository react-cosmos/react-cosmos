import React from 'react';
import { createPlugin } from 'react-plugin';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { TreeExpansion } from '../../shared/ui/TreeView';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  updateElementExpansion
} from '../../shared/ui/valueInputTree';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { ClassStatePanel } from './ClassStatePanel';
import { ClassStatePanelSpec } from './public';
import { CLASS_STATE_TREE_EXPANSION_STORAGE_KEY } from './shared';

const { namedPlug, register } = createPlugin<ClassStatePanelSpec>({
  name: 'classStatePanel'
});

namedPlug('controlPanelRow', 'classState', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
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
  const classStateExpansion =
    storage.getItem<FixtureExpansionGroup>(
      CLASS_STATE_TREE_EXPANSION_STORAGE_KEY
    ) || {};
  const onElementExpansionChange = React.useCallback(
    (elementId: FixtureElementId, treeExpansion: TreeExpansion) => {
      storage.setItem(
        CLASS_STATE_TREE_EXPANSION_STORAGE_KEY,
        updateElementExpansion(
          classStateExpansion,
          selectedFixtureId,
          elementId,
          treeExpansion
        )
      );
    },
    [storage, classStateExpansion, selectedFixtureId]
  );

  return (
    <ClassStatePanel
      fixtureState={fixtureState}
      fixtureExpansion={getFixtureExpansion(
        classStateExpansion,
        selectedFixtureId
      )}
      onFixtureStateChange={onFixtureStateChange}
      onElementExpansionChange={onElementExpansionChange}
    />
  );
});

export { register };
