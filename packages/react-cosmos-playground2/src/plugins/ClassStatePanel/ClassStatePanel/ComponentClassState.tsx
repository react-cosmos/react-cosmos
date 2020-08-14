import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateClassState,
  FixtureStateValues,
  updateFixtureStateClassState,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { IconButton32 } from '../../../shared/buttons';
import { RotateCcwIcon } from '../../../shared/icons';
import {
  Actions,
  Body,
  Container,
  Header,
  Title,
} from '../../../shared/sidePanelUi';
import { TreeExpansion } from '../../../shared/treeExpansion';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  ValueInputTree,
} from '../../../shared/valueInputTree';
import { ExpandCollapseValues } from '../../../shared/valueInputTree/ExpandCollapseValues';
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
  const treeExpansion = fixtureExpansion[strElementId] || {};
  const handleTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      onElementExpansionChange(elementId, newTreeExpansion),
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
            treeExpansion={treeExpansion}
            onTreeExpansionChange={handleTreeExpansionChange}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id={strElementId}
          values={values}
          treeExpansion={fixtureExpansion[strElementId] || {}}
          onValueChange={handleValueChange}
          onTreeExpansionChange={handleTreeExpansionChange}
        />
      </Body>
    </Container>
  );
}
