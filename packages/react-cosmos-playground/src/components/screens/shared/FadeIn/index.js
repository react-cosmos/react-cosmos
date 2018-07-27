// @flow

import React from 'react';
import styled from 'styled-components';

import type { Node } from 'react';

type Props = {
  children: Node,
  delay: number
};

export function FadeIn({ children, delay }: Props) {
  return <Container delay={delay}>{children}</Container>;
}

FadeIn.defaultProps = {
  delay: 0.5
};

const Container = styled.div`
  opacity: 0;
  transform: rotateX(15deg) translateY(32px) scale(0.9);
  animation: fade-in 0.4s linear ${props => props.delay}s forwards;
  will-change: transform, opacity;

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: rotateX(15deg) translateY(16px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: rotateX(0deg) translateY(0) scale(1);
    }
  }
`;
