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
import {
  CopyIcon,
  MinusSquareIcon,
  PlusSquareIcon,
  RotateCcwIcon,
} from '../../../shared/icons';
import { hasDirs } from '../../../shared/tree';
import {
  getFullTreeExpansion,
  isTreeFullyCollapsed,
} from '../../../shared/treeExpansion';
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
import { getFixtureStateValueTree } from '../../../shared/valueInputTree/valueTree';
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
  const strElementId = stringifyElementId(elementId);

  const [reset, setReset] = React.useState(true);
  const onResetChange = React.useCallback(() => setReset(!reset), [reset]);

  const [initialValues] = React.useState(() => values);
  const handleResetValues = React.useCallback(
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

  const treeExpansion = fixtureExpansion[strElementId] || {};
  const handleTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      onElementExpansionChange(elementId, newTreeExpansion),
    [elementId, onElementExpansionChange]
  );

  const rootNode = getFixtureStateValueTree(values);

  return (
    <Container>
      <Header>
        <Title label="Props" componentName={componentName} />
        <Actions>
          <IconButton32
            title="Reset to initial values"
            icon={<RotateCcwIcon />}
            disabled={isEqual(values, initialValues)}
            onClick={handleResetValues}
          />
          <IconButton32
            title="Reuse instances on prop changes"
            icon={<CopyIcon />}
            selected={!reset}
            disabled={false}
            onClick={onResetChange}
          />
          {!hasDirs(rootNode) ? null : isTreeFullyCollapsed(treeExpansion) ? (
            <IconButton32
              title="Expand all fixture tree folders"
              icon={<PlusSquareIcon />}
              onClick={() =>
                handleTreeExpansionChange(getFullTreeExpansion(rootNode))
              }
            />
          ) : (
            <IconButton32
              title="Collapse all fixture tree folders"
              icon={<MinusSquareIcon />}
              onClick={() => handleTreeExpansionChange({})}
            />
          )}
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
