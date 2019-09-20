import React from 'react';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { grey32 } from '../../shared/ui/colors';

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
  background: ${grey32};
  display: flex;
  flex-direction: column;
`;
