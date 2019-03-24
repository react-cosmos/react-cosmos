import * as React from 'react';
import styled from 'styled-components';
import { Slot } from 'react-plugin';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  XCircleIcon,
  RefreshCwIcon,
  MaximizeIcon,
  HomeIcon
} from '../../shared/icons';
import { Button } from '../../shared/components';

type Props = {
  selectedFixtureId: null | FixtureId;
  fullScreen: boolean;
  rendererConnected: boolean;
  validFixtureSelected: boolean;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  unselectFixture: () => void;
};

// TODO: Improve UX of refresh button, which can seem like it's not doing anything
export function RendererHeader({
  selectedFixtureId,
  fullScreen,
  rendererConnected,
  validFixtureSelected,
  selectFixture,
  unselectFixture
}: Props) {
  if (fullScreen) {
    return null;
  }

  if (!rendererConnected) {
    return (
      <Container>
        <Left>
          <Message>Waiting for renderer...</Message>
        </Left>
      </Container>
    );
  }

  if (!selectedFixtureId) {
    return (
      <Container>
        <Left>
          <Message>No fixture selected</Message>
        </Left>
        <Right>
          <Slot name="rendererActions" />
          <Button disabled icon={<MaximizeIcon />} label="fullscreen" />
        </Right>
      </Container>
    );
  }

  if (!validFixtureSelected) {
    return (
      <Container>
        <Left>
          <Message>Fixture not found</Message>
          <Button
            icon={<HomeIcon />}
            label="home"
            onClick={() => unselectFixture()}
          />
        </Left>
        <Right>
          <Slot name="rendererActions" />
          <Button disabled icon={<MaximizeIcon />} label="fullscreen" />
        </Right>
      </Container>
    );
  }

  return (
    <Container>
      <Left>
        <Button
          icon={<XCircleIcon />}
          label="close"
          onClick={() => unselectFixture()}
        />
        <Button
          icon={<RefreshCwIcon />}
          label="refresh"
          onClick={() => selectFixture(selectedFixtureId, false)}
        />
        <Slot name="fixtureActions" />
      </Left>
      <Right>
        <Slot name="rendererActions" />
        <Button
          icon={<MaximizeIcon />}
          label="fullscreen"
          onClick={() => selectFixture(selectedFixtureId, true)}
        />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
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
