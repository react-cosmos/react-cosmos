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
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId
} from '../shared';
import { createPropsFsUpdater } from './shared';

type Props = {
  fsProps: FixtureStateProps;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export function ComponentProps({
  fsProps,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange
}: Props) {
  const { componentName, elementId, values } = fsProps;
  const strElementId = stringifyElementId(elementId);

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

  const onTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      onElementExpansionChange(elementId, newTreeExpansion),
    [elementId, onElementExpansionChange]
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
        id={strElementId}
        values={values}
        treeExpansion={fixtureExpansion[strElementId] || {}}
        onValueChange={onValueChange}
        onTreeExpansionChange={onTreeExpansionChange}
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
