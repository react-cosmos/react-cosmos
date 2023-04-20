import React from 'react';
import styled from 'styled-components';
import { screenPrimary2 } from '../../style/colors.js';
import { ContentContainer, TextContainer } from './shared.js';

export function WaitingForRenderer() {
  return (
    <ContentContainer>
      <TextContainer>
        <Header>Waiting for renderer...</Header>
      </TextContainer>
    </ContentContainer>
  );
}

const Header = styled.h1`
  position: relative;
  margin: 0 0 0 0;
  color: ${screenPrimary2};
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.015em;

  ::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 64px;
    height: 3px;
    background: ${screenPrimary2};
  }
`;
