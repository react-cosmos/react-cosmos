import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { grey176, grey32, white10 } from 'react-cosmos-shared2/ui';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';

type Props = {
  selectedFixtureId: FixtureId | null;
  rendererConnected: boolean;
  validFixtureSelected: boolean;
  globalActionOrder: string[];
};

export function GlobalHeader({
  selectedFixtureId,
  rendererConnected,
  validFixtureSelected,
  globalActionOrder,
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
      <Left />
      {getMessage()}
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

const Message = styled.div`
  padding: 4px;
  color: ${grey176};
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
