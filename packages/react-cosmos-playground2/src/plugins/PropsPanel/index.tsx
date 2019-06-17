import React from 'react';
import { clone, setWith } from 'lodash';
import {
  FixtureElementId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { createPlugin } from 'react-plugin';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { PropsPanel } from './PropsPanel';
import { PropsPanelSpec } from './public';
import {
  PropsExpansion,
  FixtureExpansion,
  PROPS_TREE_EXPANSION_STORAGE_KEY,
  stringifyFixtureId,
  stringifyElementId
} from './shared';

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
    storage.getItem<PropsExpansion>(PROPS_TREE_EXPANSION_STORAGE_KEY) || {};
  const onElementExpansionChange = React.useCallback(
    (elementId: FixtureElementId, treeExpansion: TreeExpansion) => {
      storage.setItem(
        PROPS_TREE_EXPANSION_STORAGE_KEY,
        updatePropsExpansion(
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

function getFixtureExpansion(
  propsExpansion: PropsExpansion,
  fixtureId: FixtureId
): FixtureExpansion {
  return propsExpansion[stringifyFixtureId(fixtureId)] || {};
}

function updatePropsExpansion(
  propsExpansion: PropsExpansion,
  fixtureId: FixtureId,
  elementId: FixtureElementId,
  treeExpansion: TreeExpansion
): PropsExpansion {
  const valuePath = createFixtureExpansionPath(fixtureId, elementId);
  // Inspired by https://github.com/lodash/lodash/issues/1696#issuecomment-328335502
  return setWith(clone(propsExpansion), valuePath, treeExpansion, clone);
}

function createFixtureExpansionPath(
  fixtureId: FixtureId,
  elementId: FixtureElementId
): string[] {
  const strFixtureId = stringifyFixtureId(fixtureId);
  const strElementId = stringifyElementId(elementId);
  return [strFixtureId, strElementId];
}
