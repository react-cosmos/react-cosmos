import React from 'react';
import styled from 'styled-components';
import { NoWrap, SlideIn } from './shared/ui';
import { useViewportEnter } from './shared/useViewportEnter';

export function Quote() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Container ref={ref}>
      <CenterContainer>
        <QuoteBubble visible={entered}>
          <LeftSlope />
          <Words>
            You&apos;re doing important work. <NoWrap>Keep rocking.</NoWrap>
          </Words>
          <RightSlope />
        </QuoteBubble>
        <OneAndOnly visible={entered}>Dan Abramov</OneAndOnly>
      </CenterContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 20vh 0;
  display: flex;
  justify-content: center;
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const QuoteBubble = styled(SlideIn)`
  display: flex;
  flex-direction: row;
`;

const Slope = styled.div`
  width: 16px;
  background: rgba(255, 255, 255, 0.8);

  @media (max-width: 696px) {
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
  color: rgba(10, 46, 70, 0.9);
  font-size: 32px;
  font-weight: 300;
  font-style: italic;
  line-height: 38px;
  text-align: center;
  letter-spacing: -0.01em;
  transition: color 1.2s;

  @media (max-width: 400px) {
    font-size: 28px;
    line-height: 34px;
  }
`;

const OneAndOnly = styled(SlideIn)`
  padding: 16px 48px;
  color: rgba(10, 46, 70, 0.8);
  font-size: 24px;
  line-height: 24px;
  font-weight: 400;
  text-align: center;
  letter-spacing: -0.01em;
  transition-delay: ${props => (props.visible ? 0.2 : 0)}s;

  @media (max-width: 696px) {
    padding: 16px 32px;
  }

  @media (max-width: 400px) {
    font-size: 20px;
    line-height: 20px;
  }
`;
