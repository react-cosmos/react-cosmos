import React from 'react';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';

type Props = {
  rendererConnected: boolean;
  navRowOrder: string[];
};

export function Nav({ rendererConnected, navRowOrder }: Props) {
  if (!rendererConnected) {
    return <Container />;
  }

  return (
    <Container>
      <ArraySlot name="navRow" plugOrder={navRowOrder} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: var(--grey1);
  display: flex;
  flex-direction: column;
`;
