import { isEqual } from 'lodash-es';
import React, { useCallback } from 'react';
import {
  ClassStateFixtureStateItem,
  FixtureStateValues,
  updateFixtureStateClassState,
} from 'react-cosmos-core';
import {
  SidePanelActions,
  SidePanelBody,
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../../components/SidePanel.js';
import { ExpandCollapseValues } from '../../../components/ValueInputTree/ExpandCollapseValues.js';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  ValueInputTree,
  stringifyElementId,
} from '../../../components/ValueInputTree/index.js';
import { IconButton32 } from '../../../components/buttons/index.js';
import { RotateCcwIcon } from '../../../components/icons/index.js';
import { TreeExpansion } from '../../../shared/treeExpansion.js';
import { SetFixtureStateClassState } from '../shared.js';
import { classStateFsItemUpdater } from './shared.js';

type Props = {
  classStateFsItem: ClassStateFixtureStateItem;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: SetFixtureStateClassState;
  onElementExpansionChange: OnElementExpansionChange;
};

export function ComponentClassState({
  classStateFsItem,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  const { componentName, elementId, values } = classStateFsItem;

  const [initialValues] = React.useState(() => values);
  const handleValuesReset = React.useCallback(
    () =>
      onFixtureStateChange(
        classStateFsItemUpdater(elementId, prevFs =>
          updateFixtureStateClassState({
            classStateFs: prevFs,
            elementId,
            values: initialValues,
          })
        )
      ),
    [elementId, initialValues, onFixtureStateChange]
  );

  const handleValueChange = React.useCallback(
    (newValues: FixtureStateValues) => {
      onFixtureStateChange(
        classStateFsItemUpdater(elementId, prevFs =>
          updateFixtureStateClassState({
            classStateFs: prevFs,
            elementId,
            values: newValues,
          })
        )
      );
    },
    [elementId, onFixtureStateChange]
  );

  const strElementId = stringifyElementId(elementId);
  const expansion = fixtureExpansion[strElementId] || {};
  const setExpansion = useCallback(
    (newExpansion: TreeExpansion) =>
      onElementExpansionChange(elementId, newExpansion),
    [elementId, onElementExpansionChange]
  );

  return (
    <SidePanelContainer>
      <SidePanelHeader>
        <SidePanelTitle label="Class State" componentName={componentName} />
        <SidePanelActions>
          <IconButton32
            title="Reset to initial values"
            icon={<RotateCcwIcon />}
            disabled={isEqual(values, initialValues)}
            onClick={handleValuesReset}
          />
          <ExpandCollapseValues
            values={values}
            expansion={expansion}
            setExpansion={setExpansion}
          />
        </SidePanelActions>
      </SidePanelHeader>
      <SidePanelBody>
        <ValueInputTree
          id={strElementId}
          values={values}
          expansion={expansion}
          onValueChange={handleValueChange}
          setExpansion={setExpansion}
        />
      </SidePanelBody>
    </SidePanelContainer>
  );
}
