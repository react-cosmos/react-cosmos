import React from 'react';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { grey8 } from '../../shared/ui/colors';
import { ToggleNavButton } from './ToggleNavButton';

type Props = {
  validFixtureSelected: boolean;
  navOpen: boolean;
  topBarRightActionOrder: string[];
  onToggleNav: () => unknown;
};

export function TopBar({
  validFixtureSelected,
  navOpen,
  topBarRightActionOrder,
  onToggleNav
}: Props) {
  return (
    <Container>
      <Left>
        <ToggleNavButton
          disabled={!validFixtureSelected}
          selected={navOpen}
          onToggle={onToggleNav}
        />
      </Left>
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
