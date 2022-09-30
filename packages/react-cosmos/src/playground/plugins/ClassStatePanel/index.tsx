import React from 'react';
import { createPlugin, PluginContext } from 'react-plugin';
import { FixtureElementId } from '../../../core/fixtureState/types.js';
import { FixtureId } from '../../../core/types.js';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  updateElementExpansion,
} from '../../components/ValueInputTree/index.js';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { SidePanelRowSlotProps } from '../../slots/SidePanelRowSlot.js';
import { StorageSpec } from '../Storage/spec.js';
import { ClassStatePanel } from './ClassStatePanel/index.js';
import { CLASS_STATE_TREE_EXPANSION_STORAGE_KEY } from './shared.js';
import { ClassStatePanelSpec } from './spec.js';

type ClassStatePanelContext = PluginContext<ClassStatePanelSpec>;

const { namedPlug, register } = createPlugin<ClassStatePanelSpec>({
  name: 'classStatePanel',
});

namedPlug<SidePanelRowSlotProps>(
  'sidePanelRow',
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

if (process.env.NODE_ENV !== 'test') register();

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
    onElementExpansionChange,
  };
}
