import React from 'react';
import styled from 'styled-components';
import { ArraySlot } from 'react-plugin';

export function ControlPanel() {
  return (
    <Container>
      <Content>
        <ArraySlot name="controlPanelRow" />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: var(--grey2);
  color: var(--grey6);
`;

const Content = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;
