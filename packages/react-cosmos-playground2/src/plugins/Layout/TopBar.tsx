import React from 'react';
import styled from 'styled-components';
import { grey8 } from '../../shared/ui/colors';
import { ToggleNavButton } from './ToggleNavButton';

type Props = {
  validFixtureSelected: boolean;
  navOpen: boolean;
  onToggleNav: () => unknown;
};

export function TopBar({ validFixtureSelected, navOpen, onToggleNav }: Props) {
  return (
    <Container>
      <ToggleNavButton
        disabled={!validFixtureSelected}
        selected={navOpen}
        onToggle={onToggleNav}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 32px;
  padding: 4px;
  background: ${grey8};

  > button {
    margin-left: 4px;

    :first-child {
      margin-left: 0;
    }
  }
`;
