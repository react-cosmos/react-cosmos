import React from 'react';
import { isEqual } from 'lodash';
import styled from 'styled-components';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  FixtureState,
  FixtureStateValues,
  FixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { TreeExpansion } from '../../../shared/ui/TreeView';
import { DarkIconButton } from '../../../shared/ui/buttons';
import {
  ValueInputTree,
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId
} from '../../../shared/ui/valueInputTree';
import { RotateCcwIcon } from '../../../shared/icons';
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
  onElementExpansionChange
}: Props) {
  const { componentName, elementId, values } = fsClassState;
  const strElementId = stringifyElementId(elementId);

  const [initialValues] = React.useState(() => values);
  const onResetValues = React.useCallback(
    () =>
      onFixtureStateChange(
        createClassStateFsUpdater(elementId, prevFs =>
          updateFixtureStateClassState({
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
      onFixtureStateChange(
        createClassStateFsUpdater(elementId, prevFs =>
          updateFixtureStateClassState({
            fixtureState: prevFs,
            elementId,
            values: newValues
          })
        )
      );
    },
    [elementId, onFixtureStateChange]
  );

  const onTreeExpansionChange = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      onElementExpansionChange(elementId, newTreeExpansion),
    [elementId, onElementExpansionChange]
  );

  return (
    <Container>
      <Header>
        <Title>
          <strong>CLASS STATE</strong>
          <ComponentName>
            {componentName ? componentName : <em>Unnamed</em>}
          </ComponentName>
        </Title>
        <Actions>
          <DarkIconButton
            title="Reset to initial values"
            icon={<RotateCcwIcon />}
            disabled={isEqual(values, initialValues)}
            onClick={onResetValues}
          />
        </Actions>
      </Header>
      <Body>
        <ValueInputTree
          id={strElementId}
          values={values}
          treeExpansion={fixtureExpansion[strElementId] || {}}
          onValueChange={onValueChange}
          onTreeExpansionChange={onTreeExpansionChange}
        />
      </Body>
    </Container>
  );
}

const Container = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  :first-child {
    border-top: none;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 12px 0 16px;
  line-height: 32px;
`;

const Title = styled.div`
  color: var(--grey4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  strong {
    font-weight: 500;
    color: var(--grey5);
  }
`;

const ComponentName = styled.span`
  padding: 0 8px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
`;

const Body = styled.div`
  padding: 4px 12px 8px 16px;
`;
