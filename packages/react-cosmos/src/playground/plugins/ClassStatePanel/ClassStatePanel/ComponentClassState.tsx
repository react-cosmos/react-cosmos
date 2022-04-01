import { isEqual } from 'lodash';
import React, { useCallback } from 'react';
import { updateFixtureStateClassState } from '../../../../utils/fixtureState/classState';
import {
  FixtureState,
  FixtureStateClassState,
  FixtureStateValues,
} from '../../../../utils/fixtureState/types';
import { StateUpdater } from '../../../../utils/types';
import { IconButton32 } from '../../../components/buttons';
import { RotateCcwIcon } from '../../../components/icons';
import {
  SidePanelActions,
  SidePanelBody,
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../../components/SidePanel';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  ValueInputTree,
} from '../../../components/ValueInputTree';
import { ExpandCollapseValues } from '../../../components/ValueInputTree/ExpandCollapseValues';
import { TreeExpansion } from '../../../utils/treeExpansion';
import { createClassStateFsUpdater } from './shared';

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
