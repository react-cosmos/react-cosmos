import React from 'react';
import styled from 'styled-components';
import { NavRowSlot } from '../../shared/slots/NavRowSlot';
import { grey32 } from '../../shared/ui/colors';

type Props = {
  rendererConnected: boolean;
  navRowOrder: string[];
  onCloseNav: () => unknown;
};

export function Nav({ rendererConnected, navRowOrder, onCloseNav }: Props) {
  if (!rendererConnected) {
    return <Container />;
  }

  return (
    <Container>
      <NavRowSlot slotProps={{ onCloseNav }} plugOrder={navRowOrder} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${grey32};
  display: flex;
  flex-direction: column;
`;
