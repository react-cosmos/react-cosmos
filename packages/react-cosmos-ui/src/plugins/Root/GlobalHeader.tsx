import React from 'react';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { grey32, white10 } from '../../style/colors.js';

type Props = {
  rendererConnected: boolean;
  globalActionOrder: string[];
};

export function GlobalHeader({ rendererConnected, globalActionOrder }: Props) {
  return (
    <Container>
      <Left />
      <Right>
        {rendererConnected && (
          <ArraySlot name="globalAction" plugOrder={globalActionOrder} />
        )}
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
  border-bottom: 1px solid ${white10};
  background: ${grey32};
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
