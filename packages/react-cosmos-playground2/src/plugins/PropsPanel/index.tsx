import React from 'react';
import {
  FixtureElementId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin, PluginContext } from 'react-plugin';
import { ControlPanelRowSlotProps } from '../../shared/slots/ControlPanelRowSlot';
import { TreeExpansion } from '../../shared/ui/TreeView';
import {
  FixtureExpansionGroup,
  getFixtureExpansion,
  hasFsValues,
  updateElementExpansion
} from '../../shared/ui/valueInputTree';
import { StorageSpec } from '../Storage/public';
import { BlankState } from './BlankState';
import { PropsPanel } from './PropsPanel';
import { PropsPanelSpec } from './public';
import { PROPS_TREE_EXPANSION_STORAGE_KEY } from './shared';

type PropsPanelContext = PluginContext<PropsPanelSpec>;

const { namedPlug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel'
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
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
namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'blankState',
  ({ slotProps }) => {
    const { fixtureState } = slotProps;
    return shouldShowBlankState(fixtureState) ? <BlankState /> : null;
  }
);

export { register };

function useFixtureExpansion(
  pluginContext: PropsPanelContext,
  fixtureId: FixtureId
) {
  const { getMethodsOf } = pluginContext;
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
          fixtureId,
          elementId,
          treeExpansion
        )
      );
    },
    [storage, propsExpansion, fixtureId]
  );

  return {
    fixtureExpansion: getFixtureExpansion(propsExpansion, fixtureId),
    onElementExpansionChange
  };
}

function shouldShowBlankState(fixtureState: FixtureState) {
  // Don't show blank state until props (empty or not) have been read
  if (!fixtureState.props) {
    return false;
  }

  const hasProps = fixtureState.props.some(hasFsValues);
  if (hasProps) {
    return false;
  }

  const hasClassState =
    fixtureState.classState && fixtureState.classState.some(hasFsValues);
  if (hasClassState) {
    return false;
  }

  const hasValues =
    fixtureState.values && Object.keys(fixtureState.values).length > 0;
  if (hasValues) {
    return false;
  }

  return true;
}
