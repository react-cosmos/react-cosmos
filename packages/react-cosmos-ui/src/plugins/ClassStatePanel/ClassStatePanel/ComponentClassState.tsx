import { isEqual } from 'lodash-es';
import React, { useCallback } from 'react';
import {
  FixtureState,
  FixtureStateClassState,
  FixtureStateValues,
  StateUpdater,
  updateFixtureStateClassState,
} from 'react-cosmos-core';
import { IconButton32 } from '../../../components/buttons/index.js';
import { RotateCcwIcon } from '../../../components/icons/index.js';
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
  stringifyElementId,
  ValueInputTree,
} from '../../../components/ValueInputTree/index.js';
import { TreeExpansion } from '../../../shared/treeExpansion.js';
import { createClassStateFsUpdater } from './shared.js';

type Props = {
  fsClassState: FixtureStateClassState;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export function ComponentClassState({
  fsClassState,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  const { componentName, elementId, values } = fsClassState;

  const [initialValues] = React.useState(() => values);
  const handleValuesReset = React.useCallback(
    () =>
      onFixtureStateChange(
        createClassStateFsUpdater(elementId, prevFs =>
          updateFixtureStateClassState({
            fixtureState: prevFs,
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
        createClassStateFsUpdater(elementId, prevFs =>
          updateFixtureStateClassState({
            fixtureState: prevFs,
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
