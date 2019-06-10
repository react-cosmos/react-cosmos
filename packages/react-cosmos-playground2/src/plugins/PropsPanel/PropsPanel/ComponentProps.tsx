import React from 'react';
import { isEqual } from 'lodash';
import styled from 'styled-components';
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

  const [reset, setReset] = React.useState(true);
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
    <Container>
      <Header>
        <Title>
          <strong>PROPS</strong> (
          {componentName ? componentName : <em>Unnamed</em>})
        </Title>
        <button
          onClick={onResetValues}
          disabled={isEqual(values, initialValues)}
        >
          reset
        </button>
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
      <Footer>
        <label>
          <input type="checkbox" checked={reset} onChange={onResetChange} />{' '}
          Reset
        </label>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  :first-child {
    border-top: none;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 40px;
`;

const Title = styled.div``;

const Body = styled.div``;

const Footer = styled.div`
  display: flow;
  justify-content: flex-end;
  line-height: 40px;
`;
