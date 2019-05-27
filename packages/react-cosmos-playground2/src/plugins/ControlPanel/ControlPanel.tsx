import * as React from 'react';
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
  flex-shrink: 0;
  width: 288px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: inset 2px 0px 0 rgba(0, 0, 0, 0.3);
  background: var(--grey2);
  color: var(--grey6);
`;

const Content = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;
