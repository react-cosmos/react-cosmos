import React from 'react';
import styled from 'styled-components';
import { createGreyColor, grey192 } from '../../../style/colors.js';

export function RemoteRendererConnected() {
  return (
    <Container>
      <Message>Remote renderer connected</Message>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${createGreyColor(8, 0.85)};
  border-radius: 3px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Message = styled.p`
  color: ${grey192};
  text-transform: uppercase;
  white-space: nowrap;
`;
