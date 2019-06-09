import React from 'react';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateValues,
  FixtureStateProps,
  updateFixtureStateProps,
  resetFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { ValueInputTree } from '../../../shared/ui/ValueInputTree';
import { TreeExpansion } from '../../../shared/ui';
import { OnElementTreeExpansion, TreeExpansionGroup } from '../shared';
import { createPropsFsUpdater } from './shared';

type OnFixtureStateChange = (stateUpdater: StateUpdater<FixtureState>) => void;

type OnResetValues = (elementId: FixtureElementId) => unknown;

type Props = {
  fsProps: FixtureStateProps;
  treeExpansion: TreeExpansionGroup;
  onFixtureStateChange: OnFixtureStateChange;
  onResetValues: OnResetValues;
  onTreeExpansionChange: OnElementTreeExpansion;
};

export function ComponentProps({
  fsProps,
  treeExpansion,
  onFixtureStateChange,
  onResetValues,
  onTreeExpansionChange
}: Props) {
  const [reset, setReset] = React.useState(false);
  const { componentName, elementId, values } = fsProps;
  const id = createStringId(elementId);
  const callbacks = useElementBoundCallbacks({
    elementId,
    reset,
    onFixtureStateChange,
    onResetValues,
    onTreeExpansionChange
  });
  const onResetChange = React.useCallback(() => setReset(!reset), [reset]);

  return (
    <>
      <div>
        <strong>PROPS</strong> (
        {componentName ? componentName : <em>Unnamed</em>})
        <button onClick={callbacks.onResetValues}>reset</button>
      </div>
      <ValueInputTree
        id={id}
        values={values}
        treeExpansion={treeExpansion[id] || {}}
        onValueChange={callbacks.onValueChange}
        onTreeExpansionChange={callbacks.onTreeExpansionChange}
      />
      <div>
        <label>
          <input type="checkbox" checked={reset} onChange={onResetChange} />{' '}
          Reset
        </label>
      </div>
    </>
  );
}

function useElementBoundCallbacks({
  elementId,
  reset,
  onFixtureStateChange,
  onResetValues,
  onTreeExpansionChange
}: {
  elementId: FixtureElementId;
  reset: boolean;
  onFixtureStateChange: OnFixtureStateChange;
  onResetValues: OnResetValues;
  onTreeExpansionChange: OnElementTreeExpansion;
}) {
  return {
    onValueChange: React.useCallback(
      (values: FixtureStateValues) => {
        const changeFn = reset
          ? resetFixtureStateProps
          : updateFixtureStateProps;
        onFixtureStateChange(
          createPropsFsUpdater(elementId, prevFs =>
            changeFn({
              fixtureState: prevFs,
              elementId,
              values
            })
          )
        );
      },
      [elementId, reset, onFixtureStateChange]
    ),
    onResetValues: React.useCallback(() => onResetValues(elementId), [
      elementId,
      onResetValues
    ]),
    onTreeExpansionChange: React.useCallback(
      (newTreeExpansion: TreeExpansion) =>
        onTreeExpansionChange(elementId, newTreeExpansion),
      [elementId, onTreeExpansionChange]
    )
  };
}

function createStringId(elementId: FixtureElementId) {
  const { decoratorId, elPath } = elementId;
  return elPath ? `${decoratorId}-${elPath}` : decoratorId;
}
