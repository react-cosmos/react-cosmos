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
  updateElementExpansion,
  hasFsValues
} from '../../shared/ui/valueInputTree';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { PropsPanel } from './PropsPanel';
import { PropsPanelSpec } from './public';
import { PROPS_TREE_EXPANSION_STORAGE_KEY } from './shared';
import { BlankState } from './BlankState';

const { namedPlug, register } = createPlugin<PropsPanelSpec>({
  name: 'propsPanel'
});

namedPlug('controlPanelRow', 'props', ({ pluginContext }) => {
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

// WARNING: This plug has to be aware of all control types and only show up
// when none is available
// TODO: Replace this with a more generic blank state (controls in general not
// just props)
namedPlug('controlPanelRow', 'blankState', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const routerCore = getMethodsOf<RouterSpec>('router');
  const selectedFixtureId = routerCore.getSelectedFixtureId();
  if (selectedFixtureId === null) {
    return null;
  }

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  return shouldShowBlankState(fixtureState) ? <BlankState /> : null;
});

export { register };

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

  const hasSelects =
    fixtureState.selects && Object.keys(fixtureState.selects).length > 0;
  if (hasSelects) {
    return false;
  }

  return true;
}
