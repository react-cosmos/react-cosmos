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

// WARNING: This plug has to be aware of all control types and only show up
// when none is available
// TODO: Replace this with a more generic blank state (controls in general not
// just props)
plug('controlPanelRow', ({ pluginContext: { getMethodsOf } }) => {
  const routerCore = getMethodsOf<RouterSpec>('router');
  const selectedFixtureId = routerCore.getSelectedFixtureId();
  if (selectedFixtureId === null) {
    return null;
  }

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();

  // Don't show blank state until props (empty or not) have been received
  if (!fixtureState.props) {
    return null;
  }

  const propValues = fixtureState.props.some(hasFsValues);
  const stateValues =
    fixtureState.classState && fixtureState.classState.some(hasFsValues);
  return !propValues && !stateValues ? <BlankState /> : null;
});

export { register };
