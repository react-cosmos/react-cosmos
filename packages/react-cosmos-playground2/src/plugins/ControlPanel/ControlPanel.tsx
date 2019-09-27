import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { ControlPanelRowSlot } from '../../shared/slots/ControlPanelRowSlot';
import { grey32 } from '../../shared/ui/colors';

type Props = {
  fixtureId: FixtureId;
  controlPanelRowOrder: string[];
};

export function ControlPanel({ fixtureId, controlPanelRowOrder }: Props) {
  return (
    <Container>
      <Content>
        <ControlPanelRowSlot
          slotProps={{ fixtureId }}
          plugOrder={controlPanelRowOrder}
        />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: ${grey32};
`;

const Content = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;
