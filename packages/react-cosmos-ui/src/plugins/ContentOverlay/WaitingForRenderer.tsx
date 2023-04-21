import React from 'react';
import styled from 'styled-components';
import { DelayedLoading } from '../../components/DelayedLoading.js';
import { screenPrimary2 } from '../../style/colors.js';
import { ContentContainer, TextContainer } from './shared.js';

export function WaitingForRenderer() {
  return (
    <ContentContainer>
      <TextContainer>
        <DelayedLoading delay={500}>
          <Header>
            <WaitingText>Waiting for renderer</WaitingText>
            <Dot delay={0.3}>.</Dot>
            <Dot delay={0.15}>.</Dot>
            <Dot delay={0}>.</Dot>
          </Header>
        </DelayedLoading>
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
`;

const WaitingText = styled.span`
  padding-right: 3px;
`;

const Dot = styled.span<{ delay: number }>`
  display: inline-block;
  font-size: 36px;
  padding-left: 2px;
  animation: flashBounce 1.2s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  user-select: none;

  @keyframes flashBounce {
    0% {
      opacity: 1;
      transform: translate(0, 0px);
    }
    40% {
      opacity: 0.4;
      transform: translate(0, -3px);
    }
    80%,
    100% {
      opacity: 1;
      transform: translate(0, 0px);
    }
  }
`;
