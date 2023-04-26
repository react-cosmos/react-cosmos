import React from 'react';
import { FixtureElementId, FixtureId, FixtureState } from 'react-cosmos-core';
import { PluginContext, createPlugin } from 'react-plugin';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  hasFsValues,
  updateElementExpansion,
} from '../../components/ValueInputTree/index.js';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { SidePanelRowSlotProps } from '../../slots/SidePanelRowSlot.js';
import { StorageSpec } from '../Storage/spec.js';
import { BlankState } from './BlankState.js';
import { PropsPanel } from './PropsPanel/index.js';
import { PROPS_TREE_EXPANSION_STORAGE_KEY } from './shared.js';
import { PropsPanelSpec } from './spec.js';

type PropsPanelContext = PluginContext<PropsPanelSpec>;

const { namedPlug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel',
});

namedPlug<SidePanelRowSlotProps>(
  'sidePanelRow',
  'props',
  ({ pluginContext, slotProps }) => {
    const { fixtureId, fixtureState, onFixtureStateChange } = slotProps;
    const { fixtureExpansion, onElementExpansionChange } = useFixtureExpansion(
      pluginContext,
      fixtureId
    );

    return (
      <PropsPanel
        fixtureState={fixtureState}
        fixtureExpansion={fixtureExpansion}
        onFixtureStateChange={onFixtureStateChange}
        onElementExpansionChange={onElementExpansionChange}
      />
    );
  }
);

// WARNING: This plug has to be aware of all control types and only show up
// when none is available
// TODO: Replace this with a more generic blank state (controls in general not
// just props)
namedPlug<SidePanelRowSlotProps>(
  'sidePanelRow',
  'blankState',
  ({ slotProps }) => {
    const { fixtureState } = slotProps;
    return shouldShowBlankState(fixtureState) ? <BlankState /> : null;
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();

const DEFAULT_TREE_EXPANSION = {};

function useFixtureExpansion(context: PropsPanelContext, fixtureId: FixtureId) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');

  const propsExpansion =
    storage.getItem<FixtureExpansionGroup>(PROPS_TREE_EXPANSION_STORAGE_KEY) ||
    DEFAULT_TREE_EXPANSION;
  const fixtureExpansion = getFixtureExpansion(propsExpansion, fixtureId);

  const onElementExpansionChange = React.useCallback(
    (elementId: FixtureElementId, treeExpansion: TreeExpansion) => {
      storage.setItem(
        PROPS_TREE_EXPANSION_STORAGE_KEY,
        updateElementExpansion(
          propsExpansion,
          fixtureId,
          elementId,
          treeExpansion
        )
      );
    },
    [storage, propsExpansion, fixtureId]
  );

  return {
    fixtureExpansion,
    onElementExpansionChange,
  };
}

function shouldShowBlankState(fixtureState: FixtureState) {
  // Don't show blank state until props (empty or not) have been read
  if (!fixtureState.props) return false;

  const hasProps = fixtureState.props.some(hasFsValues);
  if (hasProps) return false;

  const hasClassState =
    fixtureState.classState && fixtureState.classState.some(hasFsValues);
  if (hasClassState) return false;

  const hasControls =
    fixtureState.controls && Object.keys(fixtureState.controls).length > 0;
  if (hasControls) return false;

  return true;
}
