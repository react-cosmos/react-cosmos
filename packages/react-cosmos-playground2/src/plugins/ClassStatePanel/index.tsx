import React from 'react';
import { FixtureElementId } from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin, PluginContext } from 'react-plugin';
import { ControlPanelRowSlotProps } from '../../shared/slots/ControlPanelRowSlot';
import { TreeExpansion } from '../../shared/ui/TreeView';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  updateElementExpansion
} from '../../shared/ui/valueInputTree';
import { StorageSpec } from '../Storage/public';
import { ClassStatePanel } from './ClassStatePanel';
import { ClassStatePanelSpec } from './public';
import { CLASS_STATE_TREE_EXPANSION_STORAGE_KEY } from './shared';

type ClassStatePanelContext = PluginContext<ClassStatePanelSpec>;

const { namedPlug, register } = createPlugin<ClassStatePanelSpec>({
  name: 'classStatePanel'
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'classState',
  ({ pluginContext, slotProps }) => {
    const { fixtureId, fixtureState, onFixtureStateChange } = slotProps;
    const { fixtureExpansion, onElementExpansionChange } = useFixtureExpansion(
      pluginContext,
      fixtureId
    );

    return (
      <ClassStatePanel
        fixtureState={fixtureState}
        fixtureExpansion={fixtureExpansion}
        onFixtureStateChange={onFixtureStateChange}
        onElementExpansionChange={onElementExpansionChange}
      />
    );
  }
);

export { register };

const DEFAULT_TREE_EXPANSION = {};

function useFixtureExpansion(
  context: ClassStatePanelContext,
  fixtureId: FixtureId
) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');

  const classStateExpansion =
    storage.getItem<FixtureExpansionGroup>(
      CLASS_STATE_TREE_EXPANSION_STORAGE_KEY
    ) || DEFAULT_TREE_EXPANSION;
  const fixtureExpansion = getFixtureExpansion(classStateExpansion, fixtureId);

  const onElementExpansionChange = React.useCallback(
    (elementId: FixtureElementId, treeExpansion: TreeExpansion) => {
      storage.setItem(
        CLASS_STATE_TREE_EXPANSION_STORAGE_KEY,
        updateElementExpansion(
          classStateExpansion,
          fixtureId,
          elementId,
          treeExpansion
        )
      );
    },
    [storage, classStateExpansion, fixtureId]
  );

  return {
    fixtureExpansion,
    onElementExpansionChange
  };
}
