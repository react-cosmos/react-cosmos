import React from 'react';
import {
  FixtureElementId,
  FixtureStateValues,
  FixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { ValueInputTree } from '../../../shared/ui/ValueInputTree';
import { TreeExpansion } from '../../../shared/ui';
import { OnElementTreeExpansion, TreeExpansionGroup } from '../shared';

type OnValueChange = (
  elementId: FixtureElementId,
  values: FixtureStateValues
) => unknown;

type OnResetValues = (elementId: FixtureElementId) => unknown;

type Props = {
  fsProps: FixtureStateProps;
  treeExpansion: TreeExpansionGroup;
  onValueChange: OnValueChange;
  onResetValues: OnResetValues;
  onTreeExpansionChange: OnElementTreeExpansion;
};

export function ComponentProps({
  fsProps,
  treeExpansion,
  onValueChange,
  onResetValues,
  onTreeExpansionChange
}: Props) {
  const { componentName, elementId, values } = fsProps;
  const callbacks = useElementBoundCallbacks({
    elementId,
    onValueChange,
    onResetValues,
    onTreeExpansionChange
  });
  const id = createStringId(elementId);
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
    </>
  );
}

function useElementBoundCallbacks({
  elementId,
  onValueChange,
  onResetValues,
  onTreeExpansionChange
}: {
  elementId: FixtureElementId;
  onValueChange: OnValueChange;
  onResetValues: OnResetValues;
  onTreeExpansionChange: OnElementTreeExpansion;
}) {
  return {
    onValueChange: React.useCallback(
      (newValues: FixtureStateValues) => onValueChange(elementId, newValues),
      [elementId, onValueChange]
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
