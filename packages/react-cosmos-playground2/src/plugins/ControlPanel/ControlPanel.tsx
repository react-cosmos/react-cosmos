import React from 'react';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { grey32 } from '../../shared/ui/colors';

type Props = {
  controlPanelRowOrder: string[];
};

export function ControlPanel({ controlPanelRowOrder }: Props) {
  return (
    <Container>
      <Content>
        <ArraySlot name="controlPanelRow" plugOrder={controlPanelRowOrder} />
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
