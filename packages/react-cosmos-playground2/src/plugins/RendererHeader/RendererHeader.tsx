import React from 'react';
import styled from 'styled-components';
import { ArraySlot } from 'react-plugin';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { XCircleIcon, RefreshCwIcon, HomeIcon } from '../../shared/icons';
import { IconButton } from '../../shared/ui/buttons';

type Props = {
  rendererActionOrder: string[];
  selectedFixtureId: null | FixtureId;
  rendererConnected: boolean;
  validFixtureSelected: boolean;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  unselectFixture: () => void;
};

export const RendererHeader = React.memo(function RendererHeader({
  rendererActionOrder,
  selectedFixtureId,
  rendererConnected,
  validFixtureSelected,
  selectFixture,
  unselectFixture
}: Props) {
  if (!rendererConnected) {
    return (
      <Container>
        <Left>
          <Message>Waiting for renderer...</Message>
        </Left>
      </Container>
    );
  }

  const rendererActionSlot = (
    <ArraySlot name="rendererAction" plugOrder={rendererActionOrder} />
  );

  if (!selectedFixtureId) {
    return (
      <Container>
        <Left>
          <Message>No fixture selected</Message>
        </Left>
        <Right>{rendererActionSlot}</Right>
      </Container>
    );
  }

  if (!validFixtureSelected) {
    return (
      <Container>
        <Left>
          <Message>Fixture not found</Message>
          <IconButton
            icon={<HomeIcon />}
            title="Go home"
            onClick={() => unselectFixture()}
          />
        </Left>
        <Right>{rendererActionSlot}</Right>
      </Container>
    );
  }

  return (
    <Container>
      <Left>
        <IconButton
          icon={<XCircleIcon />}
          title="Close fixture"
          onClick={() => unselectFixture()}
        />
        <IconButton
          icon={<RefreshCwIcon />}
          title="Reload fixture"
          onClick={() => selectFixture(selectedFixtureId, false)}
        />
        <ArraySlot name="fixtureAction" />
      </Left>
      <Right>{rendererActionSlot}</Right>
    </Container>
  );
});

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 8px;
  border-bottom: 1px solid var(--grey5);
  background: var(--grey6);
  color: var(--grey3);
  white-space: nowrap;
  overflow-x: auto;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Message = styled.span`
  margin: 0 4px;

  strong {
    font-weight: 600;
  }
`;
