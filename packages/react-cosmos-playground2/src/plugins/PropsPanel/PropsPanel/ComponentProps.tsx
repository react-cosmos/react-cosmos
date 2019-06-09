import React from 'react';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
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
  const onResetChange = React.useCallback(() => setReset(!reset), [reset]);

  const [initialValues] = React.useState(() => values);
  const onResetValues = React.useCallback(
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
  );

  const onValueChange = React.useCallback(
    (newValues: FixtureStateValues) => {
      const changeFn = reset ? resetFixtureStateProps : updateFixtureStateProps;
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          changeFn({
            fixtureState: prevFs,
            elementId,
            values: newValues
          })
        )
      );
    },
    [elementId, reset, onFixtureStateChange]
  );

  const onElementTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      onTreeExpansionChange(elementId, newTreeExpansion),
    [elementId, onTreeExpansionChange]
  );

  return (
    <>
      <div>
        <strong>PROPS</strong> (
        {componentName ? componentName : <em>Unnamed</em>})
        <button onClick={onResetValues} disabled={values === initialValues}>
          reset
        </button>
      </div>
      <ValueInputTree
        id={id}
        values={values}
        treeExpansion={treeExpansion[id] || {}}
        onValueChange={onValueChange}
        onTreeExpansionChange={onElementTreeExpansionChange}
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
