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
import {
  OnElementTreeExpansion,
  TreeExpansionGroup,
  stringifyElementId
} from '../shared';
import { createPropsFsUpdater } from './shared';

type OnFixtureStateChange = (stateUpdater: StateUpdater<FixtureState>) => void;

type Props = {
  fsProps: FixtureStateProps;
  treeExpansion: TreeExpansionGroup;
  onFixtureStateChange: OnFixtureStateChange;
  onTreeExpansionChange: OnElementTreeExpansion;
};

export function ComponentProps({
  fsProps,
  treeExpansion,
  onFixtureStateChange,
  onTreeExpansionChange
}: Props) {
  const { componentName, elementId, values } = fsProps;
  const id = stringifyElementId(elementId);

  const [reset, setReset] = React.useState(false);
  const [initialValues] = React.useState(() => values);

  const callbacks = useElementBoundCallbacks({
    elementId,
    reset,
    initialValues,
    onFixtureStateChange,
    onTreeExpansionChange
  });
  const onResetChange = React.useCallback(() => setReset(!reset), [reset]);

  return (
    <>
      <div>
        <strong>PROPS</strong> (
        {componentName ? componentName : <em>Unnamed</em>})
        <button
          onClick={callbacks.onResetValues}
          disabled={values === initialValues}
        >
          reset
        </button>
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
  initialValues,
  onFixtureStateChange,
  onTreeExpansionChange
}: {
  elementId: FixtureElementId;
  reset: boolean;
  initialValues: FixtureStateValues;
  onFixtureStateChange: OnFixtureStateChange;
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
    onResetValues: React.useCallback(
      () =>
        onFixtureStateChange(
          createPropsFsUpdater(elementId, prevFs =>
            resetFixtureStateProps({
              fixtureState: prevFs,
              elementId,
              values: initialValues
            })
          )
        ),
      [elementId, initialValues, onFixtureStateChange]
    ),
    onTreeExpansionChange: React.useCallback(
      (newTreeExpansion: TreeExpansion) =>
        onTreeExpansionChange(elementId, newTreeExpansion),
      [elementId, onTreeExpansionChange]
    )
  };
}
