import React from 'react';
import styled from 'styled-components';
import { mobileMaxWidth } from './shared/breakpoints.js';
import { getSlideInStyle, slideInTransition } from './shared/slideIn.js';
import { NoWrap } from './shared/styledPrimitives.js';
import { useViewportEnter } from './shared/useViewportEnter.js';

export function Quote() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Container ref={ref}>
      <CenterContainer>
        <QuoteBubble style={getSlideInStyle(entered, 0)}>
          <LeftSlope />
          <Words>
            You&apos;re doing important work. <NoWrap>Keep rocking.</NoWrap>
          </Words>
          <RightSlope />
        </QuoteBubble>
        <OneAndOnly style={getSlideInStyle(entered, 1)}>Dan Abramov</OneAndOnly>
      </CenterContainer>
    </Container>
  );
}

const slopeMaxWidth = 696;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const QuoteBubble = styled.div`
  display: flex;
  flex-direction: row;
  transition: ${slideInTransition};
`;

const Slope = styled.div`
  width: 16px;
  background: rgba(255, 255, 255, 0.8);

  @media (max-width: ${slopeMaxWidth}px) {
    display: none;
  }
`;

const LeftSlope = styled(Slope)`
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
`;

const RightSlope = styled(Slope)`
  clip-path: polygon(0 0, 100% 0, 0 100%);
`;

const Words = styled.div`
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.8);
  color: rgba(10, 46, 70, 0.8);
  font-size: 30px;
  font-weight: 300;
  font-style: italic;
  line-height: 1.2em;
  text-align: center;
  letter-spacing: -0.01em;

  @media (max-width: ${mobileMaxWidth}px) {
    padding: 16px 20px;
    font-size: 24px;
  }
`;

const OneAndOnly = styled.div`
  padding: 16px 48px;
  color: rgba(10, 46, 70, 0.7);
  font-size: 24px;
  font-weight: 400;
  line-height: 1em;
  text-align: center;
  letter-spacing: -0.01em;
  transition: ${slideInTransition};

  @media (max-width: ${slopeMaxWidth}px) {
    padding: 16px 32px;
  }

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 20px;
  }
`;
