import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateProps,
  FixtureStateValues,
  resetFixtureStateProps,
  updateFixtureStateProps,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { IconButton32 } from '../../../shared/buttons';
import { CopyIcon, RotateCcwIcon } from '../../../shared/icons';
import { TreeExpansion } from '../../../shared/TreeView';
import {
  Actions,
  Body,
  Container,
  FixtureExpansion,
  Header,
  OnElementExpansionChange,
  stringifyElementId,
  Title,
  ValueInputTree,
} from '../../../shared/valueInputTree';
import { ExpandCollapseValues } from '../../../shared/valueInputTree/ExpandCollapseValues';
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
  onElementExpansionChange,
}: Props) {
  const { componentName, elementId, values } = fsProps;

  const [reset, setReset] = React.useState(true);
  const handleResetToggle = React.useCallback(() => setReset(!reset), [reset]);

  const [initialValues] = React.useState(() => values);
  const handleValuesReset = React.useCallback(
    () =>
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          resetFixtureStateProps({
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
      const changeFn = reset ? resetFixtureStateProps : updateFixtureStateProps;
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          changeFn({
            fixtureState: prevFs,
            elementId,
            values: newValues,
          })
        )
      );
    },
    [elementId, reset, onFixtureStateChange]
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
        <Title label="Props" componentName={componentName} />
        <Actions>
          <IconButton32
            title="Reset to initial values"
            icon={<RotateCcwIcon />}
            disabled={isEqual(values, initialValues)}
            onClick={handleValuesReset}
          />
          <IconButton32
            title="Reuse instances on prop changes"
            icon={<CopyIcon />}
            selected={!reset}
            disabled={false}
            onClick={handleResetToggle}
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
          treeExpansion={treeExpansion}
          onValueChange={handleValueChange}
          onTreeExpansionChange={handleTreeExpansionChange}
        />
      </Body>
    </Container>
  );
}
