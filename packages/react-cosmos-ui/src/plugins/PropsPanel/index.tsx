import React, { useCallback } from 'react';
import {
  FixtureElementId,
  FixtureId,
  FixtureStateControls,
  FixtureStateProps,
} from 'react-cosmos-core';
import { PluginContext, createPlugin } from 'react-plugin';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  hasFsValues,
  updateElementExpansion,
} from '../../components/ValueInputTree/index.js';
import { TreeExpansion } from '../../shared/treeExpansion.js';
import { SidePanelRowSlotProps } from '../../slots/SidePanelRowSlot.js';
import { GetFixtureState } from '../RendererCore/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { BlankState } from './BlankState.js';
import { PropsPanel } from './PropsPanel/index.js';
import {
  PROPS_TREE_EXPANSION_STORAGE_KEY,
  SetFixtureStateProps,
} from './shared.js';
import { PropsPanelSpec } from './spec.js';

type PropsPanelContext = PluginContext<PropsPanelSpec>;

const { namedPlug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel',
});

namedPlug<SidePanelRowSlotProps>(
  'sidePanelRow',
  'props',
  ({ pluginContext, slotProps }) => {
    const { fixtureId, getFixtureState, setFixtureState } = slotProps;
    const { fixtureExpansion, onElementExpansionChange } = useFixtureExpansion(
      pluginContext,
      fixtureId
    );

    const fixtureState = getFixtureState<FixtureStateProps[]>('props');
    const onFixtureStateChange = useCallback<SetFixtureStateProps>(
      update => setFixtureState('props', update),
      [setFixtureState]
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
    const { getFixtureState } = slotProps;
    return shouldShowBlankState(getFixtureState) ? <BlankState /> : null;
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

function shouldShowBlankState(getFixtureState: GetFixtureState) {
  const props = getFixtureState<FixtureStateProps[]>('props');
  const hasProps = props && props.some(hasFsValues);
  if (hasProps) return false;

  const classState = getFixtureState<FixtureStateProps[]>('classState');
  const hasClassState = classState && classState.some(hasFsValues);
  if (hasClassState) return false;

  const controls = getFixtureState<FixtureStateControls>('controls');
  const hasControls = controls && Object.keys(controls).length > 0;
  if (hasControls) return false;

  return true;
}
