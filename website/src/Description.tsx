import React from 'react';
import styled from 'styled-components';
import { mobileMaxWidth } from './shared/breakpoints';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';
import { useViewportEnter } from './shared/useViewportEnter';

export function Description() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Container ref={ref} style={getSlideInStyle(entered)}>
      <Text>
        A dev environment for building scalable, high-quality user interfaces.
      </Text>
    </Container>
  );
}

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 20px;
  transition: ${slideInTransition};

  @media (max-width: ${mobileMaxWidth}px) {
    max-width: 600px;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 36px;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: -0.02em;
  text-align: center;
  opacity: 0.85;

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 32px;
    line-height: 36px;
  }
`;
