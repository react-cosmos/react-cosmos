import React from 'react';
import styled from 'styled-components';
import { NoWrap, SlideIn } from './shared/ui';
import { useViewportEnter } from './shared/useViewportEnter';

export function Hero() {
  const [ref, entered] = useViewportEnter(0.66);
  return (
    <Container ref={ref}>
      <Title visible={entered}>Don&apos;t settle for localhost:3000</Title>
      <Subtitle visible={entered}>
        Expect more from your <NoWrap>dev environment</NoWrap>
      </Subtitle>
      <Links visible={entered}>
        <Link
          href="https://cosmos.flatris.space/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Live demo</span>
          <Chevron />
        </Link>
        <Link
          href="https://twitter.com/ReactCosmos/status/1189127279533793281"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>React Cosmos 5 in 21 tweets</span>
          <Chevron />
        </Link>
      </Links>
    </Container>
  );
}

const Container = styled.div`
  min-height: 50vh;
  padding: 10vh 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled(SlideIn)`
  font-size: 48px;
  line-height: 50px;
  font-weight: 600;
  letter-spacing: -0.03em;
  padding: 0 0 12px 0;

  @media (max-width: 400px) {
    font-size: 40px;
    line-height: 42px;
  }
`;

const Subtitle = styled(SlideIn)`
  font-size: 32px;
  line-height: 36px;
  font-weight: 300;
  color: #566d7e;
  transition-delay: ${props => (props.visible ? 0.2 : 0)}s;

  @media (max-width: 400px) {
    font-size: 28px;
    line-height: 32px;
  }
`;

const Links = styled(SlideIn)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 48px 0 0 0;
  font-size: 24px;
  line-height: 24px;
  transition-delay: ${props => (props.visible ? 0.4 : 0)}s;

  @media (max-width: 400px) {
    font-size: 20px;
    line-height: 20px;
    font-weight: 500;
  }
`;

const Link = styled.a`
  margin: 16px 12px 0 12px;
  color: #078383;
  font-weight: 400;
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 400px) {
    font-weight: 500;
  }
`;

const Chevron = () => {
  return (
    <StyledChevron
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </StyledChevron>
  );
};

const StyledChevron = styled.svg`
  width: 24px;
  height: 24px;
  margin: 0 0 0 0px;
  transform: translate(0, 2.5px);

  @media (max-width: 400px) {
    width: 20px;
    height: 20px;
    transform: translate(0, 1.5px);
  }
`;
