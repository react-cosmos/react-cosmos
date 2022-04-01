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
  Actions,
  Body,
  Container,
  Header,
  Title,
} from '../../../shared/sidePanelUi';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  ValueInputTree,
} from '../../../shared/valueInputTree';
import { ExpandCollapseValues } from '../../../shared/valueInputTree/ExpandCollapseValues';
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
    <Container>
      <Header>
        <Title label="Class State" componentName={componentName} />
        <Actions>
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
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id={strElementId}
          values={values}
          expansion={expansion}
          onValueChange={handleValueChange}
          setExpansion={setExpansion}
        />
      </Body>
    </Container>
  );
}
