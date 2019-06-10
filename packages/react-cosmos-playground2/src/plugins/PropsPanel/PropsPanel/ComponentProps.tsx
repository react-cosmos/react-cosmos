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
import {
  TreeExpansion,
  DarkButton,
  DarkIconButton,
  ValueInputTree
} from '../../../shared/ui';
import { RefreshCwIcon, CopyIcon } from '../../../shared/icons';
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
        <DarkIconButton
          title="Reset to initial values"
          icon={<RefreshCwIcon />}
          disabled={isEqual(values, initialValues)}
          onClick={onResetValues}
        />
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
        <DarkButton
          title="Reuse instances on prop changes"
          label={'reuse instances'}
          icon={<CopyIcon />}
          selected={!reset}
          disabled={false}
          onClick={onResetChange}
        />
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
  padding: 8px 0 0 0;
  line-height: 32px;
`;

const Title = styled.div``;

const Body = styled.div`
  padding: 4px 0;
`;

const Footer = styled.div`
  display: flow;
  justify-content: flex-end;
  line-height: 40px;
  padding: 0 0 8px 0;
`;
