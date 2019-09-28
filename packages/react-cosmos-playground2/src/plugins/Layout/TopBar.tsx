import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { grey160, grey8 } from '../../shared/ui/colors';
import { ToggleNavButton } from './ToggleNavButton';

type Props = {
  selectedFixtureId: FixtureId | null;
  rendererConnected: boolean;
  validFixtureSelected: boolean;
  navOpen: boolean;
  topBarRightActionOrder: string[];
  onToggleNav: () => unknown;
};

export function TopBar({
  selectedFixtureId,
  rendererConnected,
  validFixtureSelected,
  navOpen,
  topBarRightActionOrder,
  onToggleNav
}: Props) {
  function getMessage() {
    if (!rendererConnected) {
      return <Message>Waiting for renderer...</Message>;
    }

    if (!selectedFixtureId) {
      return <Message>No fixture selected</Message>;
    }

    if (!validFixtureSelected) {
      return <Message>Fixture not found</Message>;
    }

    return null;
  }

  return (
    <Container>
      <Left>
        <ToggleNavButton
          disabled={!validFixtureSelected}
          selected={navOpen}
          onToggle={onToggleNav}
        />
      </Left>
      {getMessage()}
      <Right>
        <ArraySlot
          name="topBarRightAction"
          plugOrder={topBarRightActionOrder}
        />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 32px;
  padding: 4px;
  background: ${grey8};
`;

const Actions = styled.div`
  > button {
    margin-left: 4px;

    :first-child {
      margin-left: 0;
    }
  }
`;

const Left = styled(Actions)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled(Actions)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Message = styled.div`
  padding: 4px;
  color: ${grey160};
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
